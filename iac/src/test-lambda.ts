import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import {PulumiUtil} from './pulumi-provider'
import {
    lambdaExecPolicy,
    lambdaLoggingPolicy
} from './policies';

export const testLambdaRole = new aws.iam.Role(
    "testLambdaRole",
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

const testLambdaLoggingRoleAttachment =
    new aws.iam.RolePolicyAttachment(
        "testLambdaLoggingRoleAttachment",
        {
            role: testLambdaRole.name,
            policyArn: lambdaLoggingPolicy.arn,
        },
        {provider: PulumiUtil.awsProvider}
    );

const testLambdaExecPolicyRoleAttachment =
    new aws.iam.RolePolicyAttachment(
        "testLambdaExecPolicyRoleAttachment",
        {
            role: testLambdaRole.name,
            policyArn: lambdaExecPolicy.arn,
        },
        {provider: PulumiUtil.awsProvider}
    );


export const test_lambda = new aws.lambda.Function(
    's3OnObjectCreatedLambda',
    {
        code: new pulumi.asset.AssetArchive({
            "lambda_function.py": new pulumi.asset.FileAsset("../test_lambda/lambda_function.py"),
        }),
        role: testLambdaRole.arn,
        handler: 'lambda_function.lambda_handler',
        runtime: 'python3.7',
        memorySize: 128,
        timeout: 4,
    },
    {
        provider: PulumiUtil.awsProvider,
        dependsOn: [
            testLambdaLoggingRoleAttachment,
            testLambdaExecPolicyRoleAttachment,
        ]
    }
);
