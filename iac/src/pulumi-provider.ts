import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

const config = new pulumi.Config();
const REGION: any = config.require('aws_region');
const lsEndpoint = "http://localhost:4566"

export class PulumiUtil {
    static awsProvider: any;
    static env: string;
    static host: string;

}

PulumiUtil.host = lsEndpoint;
PulumiUtil.awsProvider = new aws.Provider("localstack", {
    skipCredentialsValidation: true,
    skipMetadataApiCheck: true,
    skipRequestingAccountId: true,
    s3UsePathStyle: true,
    accessKey: "test",
    secretKey: "test",
    region: REGION,
    // list of supported features
    // https://docs.localstack.cloud/aws/feature-coverage/
    // list of feature status
    // https://app.localstack.cloud/status
    endpoints: [{
        accessanalyzer: `${lsEndpoint}`,
        account: `${lsEndpoint}`,
        acm: `${lsEndpoint}`,
        acmpca: `${lsEndpoint}`,
        alexaforbusiness: `${lsEndpoint}`,
        amp: `${lsEndpoint}`,
        amplify: `${lsEndpoint}`,
        amplifybackend: `${lsEndpoint}`,
        apigateway: `${lsEndpoint}`,
        apigatewayv2: `${lsEndpoint}`,
        appautoscaling: `${lsEndpoint}`,
        appconfig: `${lsEndpoint}`,
        appflow: `${lsEndpoint}`,
        appintegrations: `${lsEndpoint}`,
        appintegrationsservice: `${lsEndpoint}`,
        applicationautoscaling: `${lsEndpoint}`,
        applicationcostprofiler: `${lsEndpoint}`,
        applicationdiscovery: `${lsEndpoint}`,
        applicationdiscoveryservice: `${lsEndpoint}`,
        applicationinsights: `${lsEndpoint}`,
        appmesh: `${lsEndpoint}`,
        appregistry: `${lsEndpoint}`,
        apprunner: `${lsEndpoint}`,
        appstream: `${lsEndpoint}`,
        appsync: `${lsEndpoint}`,
        athena: `${lsEndpoint}`,
        auditmanager: `${lsEndpoint}`,
        augmentedairuntime: `${lsEndpoint}`,
        autoscaling: `${lsEndpoint}`,
        autoscalingplans: `${lsEndpoint}`,
        backup: `${lsEndpoint}`,
        batch: `${lsEndpoint}`,
        braket: `${lsEndpoint}`,
        budgets: `${lsEndpoint}`,
        chime: `${lsEndpoint}`,
        cloud9: `${lsEndpoint}`,
        cloudcontrol: `${lsEndpoint}`,
        cloudcontrolapi: `${lsEndpoint}`,
        clouddirectory: `${lsEndpoint}`,
        cloudformation: `${lsEndpoint}`,
        cloudfront: `${lsEndpoint}`,
        cloudhsm: `${lsEndpoint}`,
        cloudhsmv2: `${lsEndpoint}`,
        cloudsearch: `${lsEndpoint}`,
        cloudsearchdomain: `${lsEndpoint}`,
        cloudtrail: `${lsEndpoint}`,
        cloudwatch: `${lsEndpoint}`,
        cloudwatchevents: `${lsEndpoint}`,
        cloudwatchlogs: `${lsEndpoint}`,
        codeartifact: `${lsEndpoint}`,
        codebuild: `${lsEndpoint}`,
        codecommit: `${lsEndpoint}`,
        codedeploy: `${lsEndpoint}`,
        codeguruprofiler: `${lsEndpoint}`,
        codegurureviewer: `${lsEndpoint}`,
        codepipeline: `${lsEndpoint}`,
        codestar: `${lsEndpoint}`,
        codestarconnections: `${lsEndpoint}`,
        codestarnotifications: `${lsEndpoint}`,
        cognitoidentity: `${lsEndpoint}`,
        cognitoidentityprovider: `${lsEndpoint}`,
        cognitoidp: `${lsEndpoint}`,
        cognitosync: `${lsEndpoint}`,
        comprehend: `${lsEndpoint}`,
        comprehendmedical: `${lsEndpoint}`,
        config: `${lsEndpoint}`,
        configservice: `${lsEndpoint}`,
        connect: `${lsEndpoint}`,
        connectcontactlens: `${lsEndpoint}`,
        connectparticipant: `${lsEndpoint}`,
        costandusagereportservice: `${lsEndpoint}`,
        costexplorer: `${lsEndpoint}`,
        cur: `${lsEndpoint}`,
        databasemigration: `${lsEndpoint}`,
        databasemigrationservice: `${lsEndpoint}`,
        dataexchange: `${lsEndpoint}`,
        datapipeline: `${lsEndpoint}`,
        datasync: `${lsEndpoint}`,
        dax: `${lsEndpoint}`,
        detective: `${lsEndpoint}`,
        devicefarm: `${lsEndpoint}`,
        devopsguru: `${lsEndpoint}`,
        directconnect: `${lsEndpoint}`,
        dlm: `${lsEndpoint}`,
        dms: `${lsEndpoint}`,
        docdb: `${lsEndpoint}`,
        ds: `${lsEndpoint}`,
        dynamodb: `${lsEndpoint}`,
        dynamodbstreams: `${lsEndpoint}`,
        ec2: `${lsEndpoint}`,
        ec2instanceconnect: `${lsEndpoint}`,
        ecr: `${lsEndpoint}`,
        ecrpublic: `${lsEndpoint}`,
        ecs: `${lsEndpoint}`,
        efs: `${lsEndpoint}`,
        eks: `${lsEndpoint}`,
        elasticache: `${lsEndpoint}`,
        elasticbeanstalk: `${lsEndpoint}`,
        elasticinference: `${lsEndpoint}`,
        elasticsearch: `${lsEndpoint}`,
        elasticsearchservice: `${lsEndpoint}`,
        elastictranscoder: `${lsEndpoint}`,
        elb: `${lsEndpoint}`,
        elbv2: `${lsEndpoint}`,
        emr: `${lsEndpoint}`,
        emrcontainers: `${lsEndpoint}`,
        es: `${lsEndpoint}`,
        eventbridge: `${lsEndpoint}`,
        events: `${lsEndpoint}`,
        finspace: `${lsEndpoint}`,
        finspacedata: `${lsEndpoint}`,
        firehose: `${lsEndpoint}`,
        fis: `${lsEndpoint}`,
        fms: `${lsEndpoint}`,
        forecast: `${lsEndpoint}`,
        forecastquery: `${lsEndpoint}`,
        forecastqueryservice: `${lsEndpoint}`,
        forecastservice: `${lsEndpoint}`,
        frauddetector: `${lsEndpoint}`,
        fsx: `${lsEndpoint}`,
        gamelift: `${lsEndpoint}`,
        glacier: `${lsEndpoint}`,
        globalaccelerator: `${lsEndpoint}`,
        glue: `${lsEndpoint}`,
        gluedatabrew: `${lsEndpoint}`,
        greengrass: `${lsEndpoint}`,
        greengrassv2: `${lsEndpoint}`,
        groundstation: `${lsEndpoint}`,
        guardduty: `${lsEndpoint}`,
        health: `${lsEndpoint}`,
        healthlake: `${lsEndpoint}`,
        honeycode: `${lsEndpoint}`,
        iam: `${lsEndpoint}`,
        identitystore: `${lsEndpoint}`,
        imagebuilder: `${lsEndpoint}`,
        inspector: `${lsEndpoint}`,
        iot: `${lsEndpoint}`,
        iot1clickdevices: `${lsEndpoint}`,
        iot1clickdevicesservice: `${lsEndpoint}`,
        iot1clickprojects: `${lsEndpoint}`,
        iotanalytics: `${lsEndpoint}`,
        iotdataplane: `${lsEndpoint}`,
        iotdeviceadvisor: `${lsEndpoint}`,
        iotevents: `${lsEndpoint}`,
        ioteventsdata: `${lsEndpoint}`,
        iotfleethub: `${lsEndpoint}`,
        iotjobsdataplane: `${lsEndpoint}`,
        iotsecuretunneling: `${lsEndpoint}`,
        iotsitewise: `${lsEndpoint}`,
        iotthingsgraph: `${lsEndpoint}`,
        iotwireless: `${lsEndpoint}`,
        kafka: `${lsEndpoint}`,
        kafkaconnect: `${lsEndpoint}`,
        kendra: `${lsEndpoint}`,
        kinesis: `${lsEndpoint}`,
        kinesisanalytics: `${lsEndpoint}`,
        kinesisanalyticsv2: `${lsEndpoint}`,
        kinesisvideo: `${lsEndpoint}`,
        kinesisvideoarchivedmedia: `${lsEndpoint}`,
        kinesisvideomedia: `${lsEndpoint}`,
        kinesisvideosignalingchannels: `${lsEndpoint}`,
        kms: `${lsEndpoint}`,
        lakeformation: `${lsEndpoint}`,
        lambda: `${lsEndpoint}`,
        lexmodelbuilding: `${lsEndpoint}`,
        lexmodelbuildingservice: `${lsEndpoint}`,
        lexmodels: `${lsEndpoint}`,
        lexmodelsv2: `${lsEndpoint}`,
        lexruntime: `${lsEndpoint}`,
        lexruntimeservice: `${lsEndpoint}`,
        lexruntimev2: `${lsEndpoint}`,
        licensemanager: `${lsEndpoint}`,
        lightsail: `${lsEndpoint}`,
        location: `${lsEndpoint}`,
        lookoutequipment: `${lsEndpoint}`,
        lookoutforvision: `${lsEndpoint}`,
        lookoutmetrics: `${lsEndpoint}`,
        machinelearning: `${lsEndpoint}`,
        macie: `${lsEndpoint}`,
        macie2: `${lsEndpoint}`,
        managedblockchain: `${lsEndpoint}`,
        marketplacecatalog: `${lsEndpoint}`,
        marketplacecommerceanalytics: `${lsEndpoint}`,
        marketplaceentitlement: `${lsEndpoint}`,
        marketplaceentitlementservice: `${lsEndpoint}`,
        marketplacemetering: `${lsEndpoint}`,
        mediaconnect: `${lsEndpoint}`,
        mediaconvert: `${lsEndpoint}`,
        medialive: `${lsEndpoint}`,
        mediapackage: `${lsEndpoint}`,
        mediapackagevod: `${lsEndpoint}`,
        mediastore: `${lsEndpoint}`,
        mediastoredata: `${lsEndpoint}`,
        mediatailor: `${lsEndpoint}`,
        memorydb: `${lsEndpoint}`,
        mgn: `${lsEndpoint}`,
        migrationhub: `${lsEndpoint}`,
        migrationhubconfig: `${lsEndpoint}`,
        mobile: `${lsEndpoint}`,
        // mobileanalytics: `${lsEndpoint}`,
        mq: `${lsEndpoint}`,
        mturk: `${lsEndpoint}`,
        mwaa: `${lsEndpoint}`,
        neptune: `${lsEndpoint}`,
        networkfirewall: `${lsEndpoint}`,
        networkmanager: `${lsEndpoint}`,
        nimblestudio: `${lsEndpoint}`,
        opsworks: `${lsEndpoint}`,
        opsworkscm: `${lsEndpoint}`,
        organizations: `${lsEndpoint}`,
        outposts: `${lsEndpoint}`,
        personalize: `${lsEndpoint}`,
        personalizeevents: `${lsEndpoint}`,
        personalizeruntime: `${lsEndpoint}`,
        pi: `${lsEndpoint}`,
        pinpoint: `${lsEndpoint}`,
        pinpointemail: `${lsEndpoint}`,
        pinpointsmsvoice: `${lsEndpoint}`,
        polly: `${lsEndpoint}`,
        pricing: `${lsEndpoint}`,
        prometheus: `${lsEndpoint}`,
        prometheusservice: `${lsEndpoint}`,
        proton: `${lsEndpoint}`,
        qldb: `${lsEndpoint}`,
        qldbsession: `${lsEndpoint}`,
        quicksight: `${lsEndpoint}`,
        ram: `${lsEndpoint}`,
        rds: `${lsEndpoint}`,
        rdsdata: `${lsEndpoint}`,
        rdsdataservice: `${lsEndpoint}`,
        redshift: `${lsEndpoint}`,
        redshiftdata: `${lsEndpoint}`,
        rekognition: `${lsEndpoint}`,
        resourcegroups: `${lsEndpoint}`,
        resourcegroupstagging: `${lsEndpoint}`,
        resourcegroupstaggingapi: `${lsEndpoint}`,
        robomaker: `${lsEndpoint}`,
        route53: `${lsEndpoint}`,
        route53domains: `${lsEndpoint}`,
        route53recoverycontrolconfig: `${lsEndpoint}`,
        route53recoveryreadiness: `${lsEndpoint}`,
        route53resolver: `${lsEndpoint}`,
        s3: `${lsEndpoint}`,
        s3control: `${lsEndpoint}`,
        s3outposts: `${lsEndpoint}`,
        sagemaker: `${lsEndpoint}`,
        sagemakeredgemanager: `${lsEndpoint}`,
        sagemakerfeaturestoreruntime: `${lsEndpoint}`,
        sagemakerruntime: `${lsEndpoint}`,
        savingsplans: `${lsEndpoint}`,
        schemas: `${lsEndpoint}`,
        sdb: `${lsEndpoint}`,
        secretsmanager: `${lsEndpoint}`,
        securityhub: `${lsEndpoint}`,
        serverlessapplicationrepository: `${lsEndpoint}`,
        serverlessapprepo: `${lsEndpoint}`,
        serverlessrepo: `${lsEndpoint}`,
        servicecatalog: `${lsEndpoint}`,
        servicediscovery: `${lsEndpoint}`,
        servicequotas: `${lsEndpoint}`,
        ses: `${lsEndpoint}`,
        sesv2: `${lsEndpoint}`,
        sfn: `${lsEndpoint}`,
        shield: `${lsEndpoint}`,
        signer: `${lsEndpoint}`,
        simpledb: `${lsEndpoint}`,
        sms: `${lsEndpoint}`,
        snowball: `${lsEndpoint}`,
        sns: `${lsEndpoint}`,
        sqs: `${lsEndpoint}`,
        ssm: `${lsEndpoint}`,
        ssmcontacts: `${lsEndpoint}`,
        ssmincidents: `${lsEndpoint}`,
        sso: `${lsEndpoint}`,
        ssoadmin: `${lsEndpoint}`,
        ssooidc: `${lsEndpoint}`,
        stepfunctions: `${lsEndpoint}`,
        storagegateway: `${lsEndpoint}`,
        sts: `${lsEndpoint}`,
        support: `${lsEndpoint}`,
        swf: `${lsEndpoint}`,
        synthetics: `${lsEndpoint}`,
        textract: `${lsEndpoint}`,
        timestreamquery: `${lsEndpoint}`,
        timestreamwrite: `${lsEndpoint}`,
        transcribe: `${lsEndpoint}`,
        transcribeservice: `${lsEndpoint}`,
        transcribestreaming: `${lsEndpoint}`,
        transcribestreamingservice: `${lsEndpoint}`,
        transfer: `${lsEndpoint}`,
        translate: `${lsEndpoint}`,
        waf: `${lsEndpoint}`,
        wafregional: `${lsEndpoint}`,
        wafv2: `${lsEndpoint}`,
        wellarchitected: `${lsEndpoint}`,
        workdocs: `${lsEndpoint}`,
        worklink: `${lsEndpoint}`,
        workmail: `${lsEndpoint}`,
        workmailmessageflow: `${lsEndpoint}`,
        workspaces: `${lsEndpoint}`,
        xray: `${lsEndpoint}`
    }],
})


let stackPieces: string[] = pulumi.getStack().split('.');
PulumiUtil.env = stackPieces[stackPieces.length - 1];
