import json
import os
import re
from typing import Dict, List

from aws_lambda_powertools import Logger
from jwt import PyJWKClient, decode, get_unverified_header
from jwt.algorithms import get_default_algorithms

logger: Logger = Logger()


@logger.inject_lambda_context
def lambda_handler(event, context):
    logger.info(event)
    try:
        # checks event props for errors && parse token from event
        token = parse_token_from_event(check_event_for_error(event))
        # builds policy resource base | validates token | returns policy
        return get_policy(
            build_policy_resource_base(event),
            validate_token(token),
            "sec-websocket-protocol" in event["headers"],
        )
    except Exception as e:
        logger.error(e)
        raise Exception("Unauthorized")


def check_event_for_error(event: dict) -> dict:
    """
    checks event for error & formats things for WS

    @param event: event payload coming into lambda

    @return: returns event
    """
    headers = {}
    if "headers" not in event:
        event["headers"] = {}

    for k in event["headers"]:
        headers[k.lower()] = event["headers"][k]

    event["headers"] = headers

    if "type" in event and event["type"] == "TOKEN":
        if "methodArn" not in event:
            raise Exception("Missing Arn")

        if "authorizationToken" not in event:
            raise Exception('Expected "event.authorizationToken" parameter to be set')
    elif "sec-websocket-protocol" in event["headers"]:
        protocols = headers["sec-websocket-protocol"].split(", ")

        if len(protocols) != 2 or not protocols[0] or not protocols[1]:
            raise Exception("Invalid token. required protocols not found")

        event["authorizationToken"] = f"bearer {protocols[1]}"
    else:
        raise Exception("Event Error: unable to find token. request not right")

    return event


def parse_token_from_event(event: dict) -> str:
    """
    parses token from event

    @param event: event being passed into lambda

    @return: returns the JWT token
    """
    # split prepended 'bearer' from token
    auth_token_parts = event["authorizationToken"].split(" ")
    # make sure bearer is present & that token exists
    if (
        len(auth_token_parts) != 2
        or auth_token_parts[0].lower() != "bearer"
        or not auth_token_parts[1]
    ):
        raise Exception("Invalid AuthorizationToken")
    # return token
    return auth_token_parts[1]


def build_policy_resource_base(event: dict) -> str:
    """
    build resource base for policy

    takes original method_arn & strips off HTTP method && path

    @param event: lambda event dict

    @return: returns policy resource base 'arn:aws:action:region:accountId:apiId/apiStage/'
    """

    method_arn = event["methodArn"]

    # if rest request we want the last 3 to be removed if WS we only want to remove last element
    slice_where = -3 if "type" in event and event["type"] == "TOKEN" else -1
    arn_pieces = re.split(":|/", method_arn)[:slice_where]

    if len(arn_pieces) != 7:
        raise Exception("Invalid methodArn")

    # get last 2 elements & form string
    last_element = arn_pieces[-2] + "/" + arn_pieces[-1] + "/"
    # remove last 2 elements from list
    arn_pieces = arn_pieces[: len(arn_pieces) - 2]
    # add last element to arn pieces
    arn_pieces.append(last_element)
    return ":".join(arn_pieces)


def validate_token(token: str) -> dict:
    """
    decodes token from event & verifies it with IDP JWKS_URI

    @param token: parsed token from lambda event

    @return: returns verified decoded token
    """
    # decode token from event
    header = get_unverified_header(token)
    # check for KID | needed for JWKS verification
    if "kid" not in header:
        raise Exception("Invalid token. No kid found in header")

    kid = header["kid"]
    alg = header["alg"] if "alg" in header else "RS256"

    # make sure encryption algorithm is supported by jwt lib
    if alg not in get_default_algorithms():
        raise Exception(f"Invalid token. Algorithm {alg} not supported")

    # get the signing key from auth0 jwks route
    key = PyJWKClient(os.environ["JWKS_URI"]).get_signing_key(kid)

    # decode & verify the token given specific opts
    return decode(
        token,
        key.key,
        algorithms=[alg],
        issuer=os.environ["TOKEN_ISSUER"],
        audience=os.environ["AUDIENCE"],
        options={"verify_signature": True},
    )

def get_policy(policy_resource_base: str, decoded: dict, is_ws: bool) -> dict:
    """
    builds the policy to be returned to apigw

    @param is_ws: True | False if websocket connection or not
    @param policy_resource_base: resource base for policy
    @param decoded: decoded & verified jwt token

    @return: returns policy
    """
    auth_mappings: Dict[str : List[dict]] = {
        "just_do_it.run": [
            {"resourcePath": "/just_do_it/", "method": "GET"},
        ],
    }

    resources = []
    user_permissions = decoded.get("permissions", [])
    default_action = "execute-api:Invoke"

    # loop over auth_mappings
    for perms, endpoints in auth_mappings.items():
        # loop over user permissions & look for matches
        if perms in user_permissions or perms == "principalId":
            # loop over auth_mappings endpoints & create statements for each & append to statement list
            for endpoint in endpoints:
                # rest apigw policy build
                if "method" in endpoint and "resourcePath" in endpoint and not is_ws:
                    url_build = (
                        policy_resource_base
                        + endpoint["method"]
                        + endpoint["resourcePath"]
                    )
                # ws apigw policy build
                elif "routeKey" in endpoint and is_ws:
                    url_build = policy_resource_base + endpoint["routeKey"]
                # default to error | prob don't need this but better safe than sorry
                else:
                    continue
                resources.append(url_build)

    # create context from token props
    context = {
        "scope": decoded["scope"],
        "permissions": json.dumps(decoded.get("permissions", [])),
    }
    # create & return policy
    return create_policy(
        decoded["sub"],
        [create_statement("Allow", resources, [default_action])],
        context,
    )


def create_policy(principal_id: str, statements: list, context: dict) -> dict:
    return {
        "principalId": principal_id,
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": statements,
        },
        "context": context,
    }


def create_statement(effect: str, resource: list, action: list) -> dict:
    return {
        "Effect": effect,
        "Resource": resource,
        "Action": action,
    }