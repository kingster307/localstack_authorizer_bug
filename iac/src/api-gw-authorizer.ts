import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import {PulumiUtil} from './pulumi-provider'
import {
    lambdaExecPolicy,
    lambdaLoggingPolicy
} from './policies';

const config = new pulumi.Config();

export const auth0Domain = config.require("auth0_domain");
export const accessTokenAudience = config.require("auth0_audience");

export const apiGwAuthorizerLambdaRole = new aws.iam.Role(
    "apiGwAuthorizerLambdaRole",
    {
        assumeRolePolicy: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "sts:AssumeRole",
                    Principal: {
                        Service: "lambda.amazonaws.com",
                    },
                    Effect: "Allow",
                },
            ],
        },
    },
    {provider: PulumiUtil.awsProvider}
);

const apiGwAuthorizerLambdaLoggingRoleAttachment =
    new aws.iam.RolePolicyAttachment(
        "apiGwAuthorizerLambdaLoggingRoleAttachment",
        {
            role: apiGwAuthorizerLambdaRole.name,
            policyArn: lambdaLoggingPolicy.arn,
        },
        {provider: PulumiUtil.awsProvider}
    );

const apiGwAuthorizerLambdaExecPolicyRoleAttachment =
    new aws.iam.RolePolicyAttachment(
        "apiGwAuthorizerLambdaExecPolicyRoleAttachment",
        {
            role: apiGwAuthorizerLambdaRole.name,
            policyArn: lambdaExecPolicy.arn,
        },
        {provider: PulumiUtil.awsProvider}
    );

export const apiGwAuthorizerLambda = new aws.lambda.Function(
    "apiGwAuthorizerLambda",
    {
        code: new pulumi.asset.FileArchive("../auth0_authorizer_lambda/auth0_authorizer.zip"),
        runtime: "python3.7",
        role: apiGwAuthorizerLambdaRole.arn,
        handler: "lambda_function.lambda_handler",
        memorySize: 128,
        timeout: 4,
        environment: {
            variables: {
                AUDIENCE: accessTokenAudience,
                JWKS_URI: `${auth0Domain}/.well-known/jwks.json`,
                TOKEN_ISSUER: `${auth0Domain}/`,
                POWERTOOLS_SERVICE_NAME: "apiGwAuthorizerLambda",
            },
        },
    },
    {
        provider: PulumiUtil.awsProvider,
        dependsOn: [
            apiGwAuthorizerLambdaLoggingRoleAttachment,
            apiGwAuthorizerLambdaExecPolicyRoleAttachment,
        ],
    }
);

// log group for lambda. only keeps logs for 3 days.
export const apiGwAuthorizerLambdaLogGroup = new aws.cloudwatch.LogGroup(
    "apiGwAuthorizerLambdaLogGroup",
    {
        name: pulumi.interpolate`/aws/lambda/${apiGwAuthorizerLambda.name}`,
        retentionInDays: 3,
    },
    {provider: PulumiUtil.awsProvider}
);
