# Upskill Platform Disaster Recovery Plan

## Table of Contents

1. [Overview](#overview)
2. [Recovery Objectives](#recovery-objectives)
3. [Infrastructure Components](#infrastructure-components)
4. [Backup Strategy](#backup-strategy)
5. [Recovery Procedures](#recovery-procedures)
6. [Testing and Validation](#testing-and-validation)
7. [Contact Information](#contact-information)

## Overview

The Upskill Platform disaster recovery (DR) plan provides comprehensive strategies and procedures for recovering critical backend infrastructure in the event of a regional AWS service disruption or catastrophic failure. This plan ensures business continuity with minimal data loss and downtime.

### DR Architecture
- **Primary Region**: us-west-2 (Oregon)
- **Secondary Region**: us-east-1 (N. Virginia) [for future expansion]
- **Backup Strategy**: Cross-region automated backup replication
- **Recovery Method**: Infrastructure-as-Code (CDK) and AWS Backup restore

## Recovery Objectives

### Recovery Point Objective (RPO) - Data Loss Tolerance

| Resource Type | RPO Target | Justification |
|---------------|------------|---------------|
| **Aurora PostgreSQL (Auth)** | 15 minutes | Critical user authentication data - minimal data loss acceptable |
| **Aurora PostgreSQL (Course)** | 30 minutes | Course content changes are less frequent, 30min acceptable |
| **DynamoDB (Notifications)** | 5 minutes | Real-time notifications - very low data loss tolerance |
| **DynamoDB (Activity)** | 15 minutes | User activity tracking - moderate data loss acceptable |
| **DynamoDB (Analytics)** | 1 hour | Analytics data can be regenerated from source systems |
| **Secrets Manager** | N/A | Secrets are automatically replicated by AWS |

### Recovery Time Objective (RTO) - Downtime Tolerance

| Resource Type | RTO Target | Justification |
|---------------|------------|---------------|
| **Complete Platform** | 4 hours | Maximum acceptable downtime for business continuity |
| **Aurora PostgreSQL** | 1 hour | Database recovery is critical path for application functionality |
| **DynamoDB Tables** | 30 minutes | Fast recovery with point-in-time restore capability |
| **Application Layer** | 2 hours | CDK deployment + testing and validation |
| **DNS/Load Balancer** | 15 minutes | Route 53 failover configuration |

## Infrastructure Components

### Critical Resources Protected by DR

#### Aurora PostgreSQL Clusters
- **Auth Database**: `upskill-learner-dev-pg-uswest2`
  - Connection: RDS Proxy enabled
  - Backup: Daily automated with 35-day retention
  - Cross-Region: 30-day retention in secondary region
  
- **Course Database**: `courseAuroraCluster`  
  - Configuration: Provisioned with read replica
  - Backup: Daily automated with point-in-time recovery
  - Cross-Region: Automated replication

#### DynamoDB Tables
- **Notifications Table**: `upskill-notifications`
  - Mode: On-Demand with point-in-time recovery
  - Backup: Continuous + daily snapshots
  - Cross-Region: Automated backup replication

- **Activity Streams Table**: `upskill-activity-streams`
  - Mode: On-Demand with DynamoDB Streams
  - Backup: Point-in-time recovery enabled
  - Cross-Region: Automated backup replication

- **Analytics Table**: `upskill-analytics`
  - Mode: On-Demand with TTL
  - Backup: Daily snapshots with lifecycle
  - Cross-Region: Automated backup replication

#### AWS Secrets Manager
- **Authentication Secrets**: JWT, session tokens
- **Database Credentials**: Aurora connection strings
- **External API Keys**: Payment, email, storage services
- **Automatic Replication**: Cross-region by default

## Backup Strategy

### Automated Backup Configuration

#### Daily Backup Schedule
- **Schedule**: 2:00 AM UTC daily
- **Start Window**: 1 hour (flexibility for resource availability)
- **Completion Window**: 8 hours (maximum time allowed)
- **Retention**: 35 days primary region, 30 days cross-region
- **Lifecycle**: Move to cold storage after 7 days

#### Cross-Region Replication
```yaml
Primary Backup Vault: upskill-primary-backup-vault (us-west-2)
Cross-Region Vault: upskill-dr-backup-vault (us-west-2) 
# Note: In production, cross-region vault would be in us-east-1

Copy Actions:
  - Destination: Cross-region backup vault
  - Retention: 30 days (optimized for DR scenarios)
  - Lifecycle: Cold storage after 7 days
  - Encryption: KMS customer-managed key
```

#### Backup Monitoring
- **Failure Alerts**: Immediate SNS notification to critical alerts topic
- **Duration Alerts**: Warning if backup exceeds 8 hours
- **Dashboard**: Real-time backup job status and metrics
- **CloudWatch Metrics**: Success/failure rates, job duration trends

## Recovery Procedures

### 1. Assessment and Decision

#### Trigger Conditions
- Regional AWS service outage affecting primary region
- Complete infrastructure failure (multiple AZ outage)
- Data corruption or security incident requiring clean environment
- Planned DR testing exercise

#### Decision Matrix
| Scenario | Action | Estimated RTO |
|----------|--------|---------------|
| Single AZ failure | Monitor - Aurora auto-failover | 5 minutes |
| Multi-AZ database failure | Restore from backup in primary region | 1 hour |
| Regional outage | Full DR activation to secondary region | 4 hours |
| Data corruption | Point-in-time restore | 2 hours |

### 2. Infrastructure Recovery

#### Step 1: Environment Preparation (30 minutes)
```bash
# 1. Access AWS Console in secondary region (us-east-1)
# 2. Verify IAM permissions and access
# 3. Check backup availability in cross-region vault
aws backup list-recovery-points --backup-vault-name upskill-dr-backup-vault --region us-east-1

# 4. Prepare CDK deployment environment
cd amplify/
npm install
```

#### Step 2: VPC and Networking (15 minutes)
```bash
# Deploy VPC infrastructure in secondary region
npx amplify sandbox --region us-east-1

# Update CDK stack for DR region
export AWS_REGION=us-east-1
cdk bootstrap --region us-east-1
```

#### Step 3: Database Recovery (60 minutes)

##### Aurora PostgreSQL Recovery
```bash
# List available cluster snapshots
aws rds describe-db-cluster-snapshots --db-cluster-identifier upskill-* --region us-east-1

# Restore Aurora auth cluster
aws rds restore-db-cluster-from-snapshot \
  --db-cluster-identifier upskill-auth-dr \
  --snapshot-identifier <snapshot-id> \
  --engine aurora-postgresql \
  --region us-east-1

# Restore Aurora course cluster  
aws rds restore-db-cluster-from-snapshot \
  --db-cluster-identifier upskill-course-dr \
  --snapshot-identifier <snapshot-id> \
  --engine aurora-postgresql \
  --region us-east-1
```

##### DynamoDB Recovery
```bash
# List available DynamoDB backups
aws backup list-recovery-points --backup-vault-name upskill-dr-backup-vault --region us-east-1

# Restore DynamoDB tables (example for notifications)
aws backup start-restore-job \
  --recovery-point-arn <recovery-point-arn> \
  --metadata '{"TableName":"upskill-notifications-dr"}' \
  --iam-role-arn <backup-service-role-arn> \
  --region us-east-1
```

#### Step 4: Application Layer Recovery (90 minutes)
```bash
# Update CDK configuration for DR region
# Modify amplify/backend.ts with DR region settings

# Deploy application infrastructure
cdk deploy --region us-east-1 --require-approval never

# Update DNS records to point to DR environment
aws route53 change-resource-record-sets \
  --hosted-zone-id <zone-id> \
  --change-batch file://dr-dns-changes.json
```

#### Step 5: Validation and Testing (45 minutes)
```bash
# Run automated health checks
./scripts/dr-validation.sh

# Test critical user flows
# - User authentication
# - Course enrollment
# - Notification delivery
# - Database connectivity

# Monitor application metrics
# - Check CloudWatch dashboards
# - Verify alarm status
# - Validate backup job resumption
```

### 3. Rollback Procedures

#### If DR activation is unsuccessful:
1. **Preserve Evidence**: Capture logs and error messages
2. **Revert DNS**: Point traffic back to primary region (if available)
3. **Contact AWS Support**: Open high-priority support case
4. **Stakeholder Communication**: Update business teams on status

#### If primary region recovers:
1. **Data Synchronization**: Compare data between regions
2. **Planned Cutover**: Schedule maintenance window for switch back
3. **DNS Update**: Gradually shift traffic back to primary
4. **DR Cleanup**: Terminate DR resources to avoid costs

## Testing and Validation

### Quarterly DR Testing Schedule

#### Q1: Partial Recovery Test
- **Scope**: Single database restore
- **Duration**: 2 hours
- **Validation**: Data integrity and application connectivity

#### Q2: Full Infrastructure Test  
- **Scope**: Complete environment recovery
- **Duration**: 4 hours
- **Validation**: End-to-end application functionality

#### Q3: Data Corruption Simulation
- **Scope**: Point-in-time recovery testing
- **Duration**: 3 hours
- **Validation**: Data consistency and business logic

#### Q4: Communication and Runbook Test
- **Scope**: Team coordination and procedure execution
- **Duration**: 1 hour
- **Validation**: Team readiness and documentation accuracy

### Test Checklist

#### Pre-Test Setup
- [ ] Notify stakeholders of planned test
- [ ] Verify backup availability and age
- [ ] Prepare test environment in secondary region
- [ ] Document current system state

#### During Test
- [ ] Follow DR procedures step-by-step
- [ ] Record execution times for each step
- [ ] Document any deviations or issues
- [ ] Validate application functionality

#### Post-Test Activities
- [ ] Update DR documentation with lessons learned
- [ ] Improve automation scripts based on findings
- [ ] Schedule next test date
- [ ] Archive test results and metrics

### Success Criteria
- **RTO Achievement**: Recovery completed within target timeframes
- **RPO Achievement**: Data loss within acceptable limits  
- **Functionality**: Critical business processes operational
- **Performance**: Application response times within 150% of normal
- **Monitoring**: All alarms and dashboards functional

## Contact Information

### DR Team Contacts

| Role | Primary Contact | Secondary Contact |
|------|----------------|------------------|
| **DR Coordinator** | admin@upskillplatform.com | +1-555-0100 |
| **Technical Lead** | dev-team@upskillplatform.com | +1-555-0101 |
| **Database Admin** | dba@upskillplatform.com | +1-555-0102 |
| **Infrastructure** | devops@upskillplatform.com | +1-555-0103 |

### Escalation Matrix

| Severity | Response Time | Escalation Path |
|----------|---------------|-----------------|
| **Critical** | 15 minutes | DR Coordinator → CTO → CEO |
| **High** | 30 minutes | Technical Lead → DR Coordinator |
| **Medium** | 1 hour | Database Admin → Technical Lead |

### External Contacts

| Service | Contact | Purpose |
|---------|---------|---------|
| **AWS Support** | Enterprise Support | Infrastructure assistance |
| **DNS Provider** | Route 53 Console | DNS failover management |
| **Monitoring** | CloudWatch/SNS | Alert management |

## Documentation Maintenance

- **Review Frequency**: Monthly
- **Update Triggers**: Infrastructure changes, test results, AWS service updates
- **Owner**: DevOps Team
- **Approval**: Technical Lead and DR Coordinator

---

*Last Updated: 2025-07-03*  
*Version: 1.0*  
*Next Review: 2025-08-03* 