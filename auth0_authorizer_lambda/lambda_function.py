import json
import os

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
            check_token_for_error(validate_token(token)),
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
    # For route based permissions see commented out version
    return "arn:aws:execute-api:*:*:*/*/*"  # override to allow all route keys


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


def check_token_for_error(decoded_verified_jwt: dict) -> dict:
    """
    checks verified jwt for errors

    @param decoded_verified_jwt: decoded verified jwt

    @return: returns token
    """
    if "sub" not in decoded_verified_jwt:
        raise Exception("Invalid token. No sub found")

    if "scope" not in decoded_verified_jwt:
        raise Exception("Invalid token. No scope found")

    return decoded_verified_jwt


def get_policy(policy_resource_base: str, decoded: dict, is_ws: bool) -> dict:
    # For route based permissions see commented out version
    context = {
        "scope": decoded["scope"],
        "permissions": json.dumps(decoded.get("permissions", [])),
    }
    return create_policy(
        decoded["sub"],
        [create_statement("Allow", policy_resource_base, "execute-api:Invoke")],
        context,
    )


def create_statement(effect: str, resource: list, action: list) -> dict:
    return {
        "Effect": effect,
        "Resource": resource,
        "Action": action,
    }


def create_policy(principal_id: str, statements: list, context: dict) -> dict:
    return {
        "principalId": principal_id,
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": statements,
        },
        "context": context,
    }
