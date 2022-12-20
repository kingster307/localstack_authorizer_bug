import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import {PulumiUtil} from './pulumi-provider'
import {
    lambdaExecPolicy,
    lambdaLoggingPolicy
} from './policies';

export const helloLambdaRole = new aws.iam.Role(
    "helloLambdaRole",
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

const helloLambdaLoggingRoleAttachment =
    new aws.iam.RolePolicyAttachment(
        "helloLambdaLoggingRoleAttachment",
        {
            role: helloLambdaRole.name,
            policyArn: lambdaLoggingPolicy.arn,
        },
        {provider: PulumiUtil.awsProvider}
    );

const helloLambdaExecPolicyRoleAttachment =
    new aws.iam.RolePolicyAttachment(
        "helloLambdaExecPolicyRoleAttachment",
        {
            role: helloLambdaRole.name,
            policyArn: lambdaExecPolicy.arn,
        },
        {provider: PulumiUtil.awsProvider}
    );


export const hello_lambda = new aws.lambda.Function(
    's3OnObjectCreatedLambda',
    {
        code: new pulumi.asset.AssetArchive({
            "lambda_function.py": new pulumi.asset.FileAsset("../hello_lambda/lambda_function.py"),
        }),
        role: helloLambdaRole.arn,
        handler: 'lambda_function.lambda_handler',
        runtime: 'python3.7',
        memorySize: 128,
        timeout: 4,
    },
    {
        provider: PulumiUtil.awsProvider,
        dependsOn: [
            helloLambdaLoggingRoleAttachment,
            helloLambdaExecPolicyRoleAttachment,
        ]
    }
);
