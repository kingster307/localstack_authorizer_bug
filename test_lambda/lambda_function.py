import os
import json

def lambda_handler(event, context):
    return {
        "statusCode": 200,
        "body": {"authorizer": event["requestContext"]["authorizer"]}
    }