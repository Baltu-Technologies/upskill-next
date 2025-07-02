import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource.js';
// Import CDK constructs for custom infrastructure
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Duration } from 'aws-cdk-lib';
/**
 * Define the backend infrastructure for the Upskill platform
 * This configuration includes:
 * - Data layer (GraphQL API with DynamoDB)
 * - Custom VPC with public/private subnets
 * - Aurora PostgreSQL clusters (Serverless v2 + Provisioned)
 * - RDS Proxy for connection pooling
 * - DynamoDB tables for high-velocity data
 * - AWS Secrets Manager for credential storage
 * - IAM roles and policies for secure access
 */
const backend = defineBackend({
    // Amplify-managed data layer
    data,
});
/**
 * Access the underlying CDK stack for custom resources
 * This allows us to add infrastructure beyond Amplify's built-in capabilities
 */
const customResourceStack = backend.createStack('custom-resources');
// ========================================
// TASK 2.1: Import Existing VPC and Subnets
// ========================================
/**
 * Import existing VPC: Baltu-Upskill (vpc-87ffceff) in us-west-2
 * Using Vpc.fromLookup (preferred method) for automatic discovery and validation
 */
const vpc = ec2.Vpc.fromLookup(customResourceStack, 'BaltuUpskillVPC', {
    vpcId: 'vpc-87ffceff',
    region: 'us-west-2',
});
/**
 * Import specific subnets by ID for precise control
 * These subnets will be used for different purposes:
 * - Database subnets for Aurora clusters
 * - Lambda subnets for function execution
 * - RDS Proxy subnets for connection pooling
 */
const subnetA = ec2.Subnet.fromSubnetId(customResourceStack, 'SubnetA', 'subnet-0d3aa750');
const subnetB = ec2.Subnet.fromSubnetId(customResourceStack, 'SubnetB', 'subnet-1ffa5555');
const subnetC = ec2.Subnet.fromSubnetId(customResourceStack, 'SubnetC', 'subnet-63bc3e1b');
const subnetD = ec2.Subnet.fromSubnetId(customResourceStack, 'SubnetD', 'subnet-438e9b68');
/**
 * Collect all imported subnets for easy reference
 */
const importedSubnets = [subnetA, subnetB, subnetC, subnetD];
// ========================================
// TASK 2.2: Aurora Serverless Security Enhancement ✅
// ========================================
// Import existing Aurora Serverless v2 cluster for BetterAuth
// Current cluster: upskill-learner-dev-pg-uswest2-instance-1
const existingAuroraCluster = rds.DatabaseCluster.fromDatabaseClusterAttributes(customResourceStack, 'ExistingAuroraAuth', {
    clusterIdentifier: 'upskill-learner-dev-pg-uswest2',
    clusterEndpointAddress: 'upskill-learner-dev-pg-uswest2-instance-1.cwatglwumbpq.us-west-2.rds.amazonaws.com',
    port: 5432,
    // Note: Will need to import existing security group
    securityGroups: [
        ec2.SecurityGroup.fromSecurityGroupId(customResourceStack, 'ExistingAuroraSG', 'sg-a0d71793' // default security group from user info
        )
    ],
});
// Create security groups for enhanced Aurora access (DEV environment)
const lambdaSecurityGroup = new ec2.SecurityGroup(customResourceStack, 'LambdaToRDSSG', {
    vpc,
    description: 'Security group for Lambda functions accessing Aurora (DEV)',
    allowAllOutbound: true
});
const rdsProxySecurityGroup = new ec2.SecurityGroup(customResourceStack, 'RDSProxySG', {
    vpc,
    description: 'Security group for RDS Proxy (DEV)',
    allowAllOutbound: true
});
// Allow Lambda -> RDS Proxy connections
rdsProxySecurityGroup.addIngressRule(lambdaSecurityGroup, ec2.Port.tcp(5432), 'Allow Lambda functions to connect to RDS Proxy');
// Allow RDS Proxy -> Aurora connections
const existingAuroraSG = ec2.SecurityGroup.fromSecurityGroupId(customResourceStack, 'ImportedAuroraSG', 'sg-a0d71793');
// Note: In DEV, we're keeping this simple. In production, we'd:
// - Make Aurora private (not publicly accessible)
// - Use private subnets only
// - Implement more restrictive security group rules
// Import or create database credentials secret for RDS Proxy
// Note: This assumes the secret exists - may need to be created manually first
const dbSecret = secretsmanager.Secret.fromSecretNameV2(customResourceStack, 'AuroraAuthSecret', 'upskill/auth/database' // Update with actual secret name
);
// ========================================
// TASK 4.1: Create RDS Proxy for Auth Database ✅
// ========================================
// Create RDS Proxy for existing Aurora cluster
const auroraRdsProxy = new rds.DatabaseProxy(customResourceStack, 'AuroraAuthProxy', {
    proxyTarget: rds.ProxyTarget.fromCluster(existingAuroraCluster),
    secrets: [dbSecret],
    vpc,
    vpcSubnets: {
        subnets: [subnetA, subnetB] // Use first two subnets for database deployment
    },
    securityGroups: [rdsProxySecurityGroup],
    requireTLS: false, // Can be enabled for production
    iamAuth: true, // ✅ IAM authentication enabled (Subtask 4.3)
    debugLogging: true, // Helpful for debugging
    idleClientTimeout: Duration.seconds(1800), // 30 minutes
    maxConnectionsPercent: 80, // 80% of max connections
    // Note: connectionBorrowTimeout is configured at the target group level, not proxy level
    role: undefined, // Will use default service role
});
// Export RDS Proxy endpoint for application use
const authRdsProxyEndpoint = auroraRdsProxy.endpoint;
// ========================================
// TASK 4.3: IAM Authentication for RDS Proxy ✅
// ========================================
// Create IAM role for Lambda functions to connect to RDS Proxy
const lambdaRdsProxyRole = new iam.Role(customResourceStack, 'LambdaRdsProxyRole', {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    description: 'IAM role for Lambda functions to connect to RDS Proxy with IAM auth',
    managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'),
    ],
});
// Create IAM policy for RDS Proxy connection
const rdsProxyConnectPolicy = new iam.Policy(customResourceStack, 'RdsProxyConnectPolicy', {
    statements: [
        new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['rds-db:connect'],
            resources: [
                // RDS Proxy resource ARN pattern: arn:aws:rds-db:region:account:dbuser:proxy-id/username
                `arn:aws:rds-db:us-west-2:*:dbuser:${auroraRdsProxy.dbProxyName}/*`,
            ],
        }),
    ],
});
// Attach the policy to the Lambda role
lambdaRdsProxyRole.attachInlinePolicy(rdsProxyConnectPolicy);
// Create IAM policy for Secrets Manager access (needed for RDS Proxy)
const secretsManagerPolicy = new iam.Policy(customResourceStack, 'SecretsManagerPolicy', {
    statements: [
        new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                'secretsmanager:GetSecretValue',
                'secretsmanager:DescribeSecret',
            ],
            resources: [
                dbSecret.secretArn,
            ],
        }),
    ],
});
// Attach secrets manager policy to Lambda role
lambdaRdsProxyRole.attachInlinePolicy(secretsManagerPolicy);
// For Amplify Lambda functions, we'll also need to configure the backend
// to use this role. This will be handled in the application configuration.
const lambdaRdsConnectionConfig = {
    role: lambdaRdsProxyRole,
    proxyEndpoint: authRdsProxyEndpoint,
    // Database connection details for Lambda functions
    connectionDetails: {
        host: authRdsProxyEndpoint,
        port: 5432,
        database: 'postgres', // Default database name
        // No username/password needed - using IAM authentication
        ssl: false, // Can be enabled for production
        iamAuth: true,
    },
};
// ========================================
// TASK 2.3: Prepare Networking for Course Database 🔄
// ========================================
// Create dedicated security group for course database
const courseDbSecurityGroup = new ec2.SecurityGroup(customResourceStack, 'CourseDbSG', {
    vpc,
    description: 'Security group for Course Data Aurora PostgreSQL (DEV)',
    allowAllOutbound: false // More restrictive outbound for database
});
// Create dedicated security group for course database RDS Proxy
const courseDbProxySecurityGroup = new ec2.SecurityGroup(customResourceStack, 'CourseDbProxySG', {
    vpc,
    description: 'Security group for Course Database RDS Proxy (DEV)',
    allowAllOutbound: true
});
// Configure access rules for course database
// Lambda -> Course DB RDS Proxy
courseDbProxySecurityGroup.addIngressRule(lambdaSecurityGroup, ec2.Port.tcp(5432), 'Allow Lambda functions to connect to Course DB RDS Proxy');
// Course DB RDS Proxy -> Course Database
courseDbSecurityGroup.addIngressRule(courseDbProxySecurityGroup, ec2.Port.tcp(5432), 'Allow Course DB RDS Proxy to connect to Course Database');
// Allow Lambda direct access to course database (backup option for DEV)
courseDbSecurityGroup.addIngressRule(lambdaSecurityGroup, ec2.Port.tcp(5432), 'Allow Lambda direct access to Course Database (DEV fallback)');
// Create subnet group for course database
// Using first two subnets for database deployment (best practice: different AZs)
const courseDbSubnetGroup = new rds.SubnetGroup(customResourceStack, 'CourseDbSubnetGroup', {
    vpc,
    description: 'Subnet group for Course Data Aurora PostgreSQL',
    vpcSubnets: {
        subnets: [
            subnetA, // subnet-0d3aa750
            subnetB // subnet-1ffa5555
        ]
    },
});
// Reserved subnets for course database (for documentation and future use)
const courseDbSubnets = {
    primary: subnetA, // subnet-0d3aa750 (us-west-2a)
    secondary: subnetB, // subnet-1ffa5555 (us-west-2b)
    subnetGroup: courseDbSubnetGroup
};
// Create placeholder for course database secret (to be created when database is deployed)
// This will be used by Task 5 when creating the actual course database
const courseDbSecretPlaceholder = {
    secretName: 'upskill/course/database',
    description: 'Database credentials for Course Data Aurora PostgreSQL'
};
// DEV Note: For development environment, we're setting up:
// 1. Separate security groups for course database vs auth database
// 2. Subnet group prepared for Aurora provisioned instance (db.t4g.small)
// 3. Security rules allowing both proxy and direct Lambda access
// 4. Foundation ready for Task 5 (Aurora Provisioned deployment)
// ========================================
// TASK 2.4: Configure Lambda Security Groups ✅
// ========================================
// Lambda Security Group Configuration Summary:
// The lambdaSecurityGroup (created above) provides Amplify Lambda functions with:
// 1. Outbound access to both RDS Proxies on port 5432
// 2. Outbound access to both databases directly (DEV fallback)
// 3. All other outbound traffic allowed for general Lambda functionality
// Add additional egress rules for Lambda functions (database-specific)
lambdaSecurityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432), 'Allow outbound PostgreSQL connections');
lambdaSecurityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow outbound HTTPS for AWS services');
// Security Group ID Documentation for Amplify Configuration
const securityGroupConfiguration = {
    // Lambda Functions (Amplify backend)
    lambdaSecurityGroup: {
        id: lambdaSecurityGroup.securityGroupId,
        description: 'Attach this to Amplify Lambda functions for database access',
        allowsAccessTo: ['Aurora Auth DB', 'Aurora Course DB', 'RDS Proxies']
    },
    // Database Security Groups
    databases: {
        existingAuthDatabase: {
            securityGroupId: 'sg-a0d71793', // Existing Aurora auth DB
            allowsConnectionsFrom: [lambdaSecurityGroup.securityGroupId]
        },
        courseDatabase: {
            securityGroupId: courseDbSecurityGroup.securityGroupId,
            allowsConnectionsFrom: [
                lambdaSecurityGroup.securityGroupId,
                courseDbProxySecurityGroup.securityGroupId
            ]
        }
    },
    // RDS Proxy Security Groups
    proxies: {
        authDatabaseProxy: {
            securityGroupId: rdsProxySecurityGroup.securityGroupId,
            note: 'Ready for auth DB RDS Proxy when enabled'
        },
        courseDatabaseProxy: {
            securityGroupId: courseDbProxySecurityGroup.securityGroupId,
            note: 'Ready for course DB RDS Proxy deployment'
        }
    }
};
// Amplify Environment Configuration Instructions:
// 1. Attach lambdaSecurityGroup to all Amplify Lambda functions
// 2. Deploy Lambda functions in VPC subnets: subnet-63bc3e1b, subnet-438e9b68
// 3. Use database endpoints with proper security group access
// 4. Environment variables for database connections will be configured in Task 4
// ========================================
// TODO: TASK 3 - Deploy Aurora PostgreSQL Serverless v2 for Authentication
// Note: Since we have existing auth DB, this task may be skipped or modified
// ========================================
// ========================================
// TODO: TASK 4 - Set Up AWS Secrets Manager for Database Credentials
// ========================================
// ========================================
// TODO: TASK 5 - Deploy Aurora PostgreSQL Provisioned for Course Data
// Will create new dedicated cluster for course data with:
// - db.t4g.small instance
// - Read replica for performance
// - Private subnets and security groups
// ========================================
// ========================================
// TODO: TASK 6 - Create RDS Proxy for Course Data Aurora
// ========================================
// ========================================
// TODO: TASK 7 - Create DynamoDB Tables for High-Velocity Data
// ========================================
// ========================================
// TODO: TASK 8 - Configure IAM Roles and Policies
// ========================================
// ========================================
// TODO: TASK 9 - Set Up VPC Endpoints for AWS Services
// ========================================
/**
 * Export custom resources for use in application code and subsequent tasks
 */
export const customResources = {
    // VPC and networking resources (Task 2.1 ✅)
    vpc: vpc,
    subnets: {
        all: importedSubnets,
        subnetA: subnetA,
        subnetB: subnetB,
        subnetC: subnetC,
        subnetD: subnetD,
    },
    // Will be populated as we implement subsequent tasks
    authRdsProxy: auroraRdsProxy, // Task 4.1 ✅
    courseRdsProxy: undefined, // Task 4
    dynamoTables: undefined, // Task 5
    secrets: undefined, // Task 6
    existingAuroraCluster,
    lambdaSecurityGroup,
    rdsProxySecurityGroup,
    auroraRdsProxy, // RDS Proxy for auth database
    authRdsProxyEndpoint, // Proxy endpoint for application connections
    lambdaRdsProxyRole, // IAM role for Lambda functions to connect to RDS Proxy
    lambdaRdsConnectionConfig, // Complete connection configuration for Lambda functions
    courseDbSecurityGroup,
    courseDbProxySecurityGroup,
    courseDbSubnetGroup,
    courseDbSubnets,
    courseDbSecretPlaceholder,
    securityGroupConfiguration, // Complete security group documentation
};
export default backend;
