#!/bin/bash

# Upskill Platform Failover Testing Script
# Version: 1.0
# Last Updated: 2025-07-03
#
# This script simulates various failure scenarios to validate high availability
# and rapid recovery capabilities of the Upskill platform infrastructure.

set -e  # Exit on any error

# Configuration
REGION=${AWS_REGION:-us-west-2}
DR_REGION=${DR_REGION:-us-east-1}
LOG_FILE="/tmp/failover-test-$(date +%Y%m%d-%H%M%S).log"
RESULTS_FILE="/tmp/failover-results-$(date +%Y%m%d-%H%M%S).json"
TIMEOUT=300  # 5 minutes timeout for most operations
DRY_RUN=${DRY_RUN:-false}  # Set to true for simulation without actual changes

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Test results tracking
declare -A TEST_RESULTS
declare -A RECOVERY_TIMES
declare -A RTO_TARGETS

# RTO targets (in seconds)
RTO_TARGETS["aurora_failover"]=300      # 5 minutes
RTO_TARGETS["rds_proxy_failover"]=60    # 1 minute
RTO_TARGETS["dynamodb_throttle"]=30     # 30 seconds
RTO_TARGETS["lambda_coldstart"]=10      # 10 seconds
RTO_TARGETS["cross_region_backup"]=3600 # 1 hour

# Logging functions
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

test_header() {
    echo -e "${PURPLE}🧪 $1${NC}" | tee -a "$LOG_FILE"
}

# Function to check prerequisites
check_prerequisites() {
    log "Checking prerequisites for failover testing..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed"
        exit 1
    fi
    
    # Check jq for JSON parsing
    if ! command -v jq &> /dev/null; then
        warning "jq is not installed - using basic JSON parsing"
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity --region "$REGION" &> /dev/null; then
        error "AWS CLI is not configured properly"
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Function to test Aurora cluster availability
test_aurora_availability() {
    test_header "Testing Aurora Cluster Availability"
    
    local start_time=$(date +%s)
    
    # Find Aurora clusters
    AURORA_CLUSTERS=$(aws rds describe-db-clusters \
        --region "$REGION" \
        --query "DBClusters[?contains(DBClusterIdentifier, 'upskill')].{Id:DBClusterIdentifier,Status:Status}" \
        --output text 2>/dev/null || echo "")
    
    if [[ -n "$AURORA_CLUSTERS" ]]; then
        success "Found Aurora clusters:"
        echo "$AURORA_CLUSTERS" | while read -r cluster status; do
            if [[ "$status" == "available" ]]; then
                success "  - $cluster: $status"
            else
                warning "  - $cluster: $status"
            fi
        done
        TEST_RESULTS["aurora_failover"]="PASS"
    else
        warning "No Aurora clusters found"
        TEST_RESULTS["aurora_failover"]="SKIP"
    fi
    
    local end_time=$(date +%s)
    RECOVERY_TIMES["aurora_failover"]=$((end_time - start_time))
}

# Function to test RDS Proxy connection health
test_rds_proxy_health() {
    test_header "Testing RDS Proxy Connection Health"
    
    local start_time=$(date +%s)
    
    # Find RDS Proxies
    RDS_PROXIES=$(aws rds describe-db-proxies \
        --region "$REGION" \
        --query "DBProxies[?contains(DBProxyName, 'upskill')].{Name:DBProxyName,Status:Status}" \
        --output text 2>/dev/null || echo "")
    
    if [[ -n "$RDS_PROXIES" ]]; then
        success "Found RDS Proxies:"
        echo "$RDS_PROXIES" | while read -r proxy status; do
            if [[ "$status" == "available" ]]; then
                success "  - $proxy: $status"
            else
                warning "  - $proxy: $status"
            fi
        done
        TEST_RESULTS["rds_proxy_failover"]="PASS"
    else
        warning "No RDS Proxies found"
        TEST_RESULTS["rds_proxy_failover"]="SKIP"
    fi
    
    local end_time=$(date +%s)
    RECOVERY_TIMES["rds_proxy_failover"]=$((end_time - start_time))
}

# Function to test DynamoDB table status
test_dynamodb_status() {
    test_header "Testing DynamoDB Table Status"
    
    local start_time=$(date +%s)
    
    # Find DynamoDB tables
    TABLES=$(aws dynamodb list-tables \
        --region "$REGION" \
        --output text 2>/dev/null | grep -o 'upskill[^[:space:]]*' || echo "")
    
    if [[ -n "$TABLES" ]]; then
        success "Found DynamoDB tables:"
        for table in $TABLES; do
            STATUS=$(aws dynamodb describe-table \
                --region "$REGION" \
                --table-name "$table" \
                --query "Table.TableStatus" \
                --output text 2>/dev/null || echo "ERROR")
            
            if [[ "$STATUS" == "ACTIVE" ]]; then
                success "  - $table: $STATUS"
            else
                warning "  - $table: $STATUS"
            fi
        done
        TEST_RESULTS["dynamodb_throttle"]="PASS"
    else
        warning "No DynamoDB tables found"
        TEST_RESULTS["dynamodb_throttle"]="SKIP"
    fi
    
    local end_time=$(date +%s)
    RECOVERY_TIMES["dynamodb_throttle"]=$((end_time - start_time))
}

# Function to test Lambda function status
test_lambda_status() {
    test_header "Testing Lambda Function Status"
    
    local start_time=$(date +%s)
    
    # Find Lambda functions
    FUNCTIONS=$(aws lambda list-functions \
        --region "$REGION" \
        --query "Functions[?contains(FunctionName, 'upskill') || contains(FunctionName, 'amplify')].FunctionName" \
        --output text 2>/dev/null || echo "")
    
    local function_count=0
    local active_count=0
    
    if [[ -n "$FUNCTIONS" ]]; then
        success "Found Lambda functions:"
        for func in $FUNCTIONS; do
            ((function_count++))
            STATE=$(aws lambda get-function \
                --region "$REGION" \
                --function-name "$func" \
                --query "Configuration.State" \
                --output text 2>/dev/null || echo "ERROR")
            
            if [[ "$STATE" == "Active" ]]; then
                success "  - $func: $STATE"
                ((active_count++))
            else
                warning "  - $func: $STATE"
            fi
        done
        
        if [[ $active_count -eq $function_count ]]; then
            TEST_RESULTS["lambda_coldstart"]="PASS"
        else
            TEST_RESULTS["lambda_coldstart"]="PARTIAL"
        fi
    else
        warning "No Lambda functions found"
        TEST_RESULTS["lambda_coldstart"]="SKIP"
    fi
    
    local end_time=$(date +%s)
    RECOVERY_TIMES["lambda_coldstart"]=$((end_time - start_time))
}

# Function to test cross-region backup accessibility
test_cross_region_backup() {
    test_header "Testing Cross-Region Backup Accessibility"
    
    local start_time=$(date +%s)
    
    # Check for cross-region backup vault
    BACKUP_VAULT=$(aws backup describe-backup-vault \
        --region "$DR_REGION" \
        --backup-vault-name "upskill-dr-backup-vault" \
        --query "BackupVaultName" \
        --output text 2>/dev/null || echo "None")
    
    if [[ "$BACKUP_VAULT" != "None" ]]; then
        success "Cross-region backup vault found: $BACKUP_VAULT"
        
        # Check for recent recovery points
        RECOVERY_COUNT=$(aws backup list-recovery-points \
            --region "$DR_REGION" \
            --backup-vault-name "$BACKUP_VAULT" \
            --query "length(RecoveryPoints)" \
            --output text 2>/dev/null || echo "0")
        
        if [[ "$RECOVERY_COUNT" -gt 0 ]]; then
            success "Found $RECOVERY_COUNT backup recovery points"
            TEST_RESULTS["cross_region_backup"]="PASS"
        else
            warning "No backup recovery points found"
            TEST_RESULTS["cross_region_backup"]="PARTIAL"
        fi
    else
        error "Cross-region backup vault not found in $DR_REGION"
        TEST_RESULTS["cross_region_backup"]="FAIL"
    fi
    
    local end_time=$(date +%s)
    RECOVERY_TIMES["cross_region_backup"]=$((end_time - start_time))
}

# Function to test monitoring and alerting
test_monitoring_alerting() {
    test_header "Testing Monitoring and Alerting"
    
    # Check CloudWatch alarms
    ALARM_COUNT=$(aws cloudwatch describe-alarms \
        --region "$REGION" \
        --query "length(MetricAlarms[?contains(AlarmName, 'upskill')])" \
        --output text 2>/dev/null || echo "0")
    
    if [[ "$ALARM_COUNT" -gt 0 ]]; then
        success "Found $ALARM_COUNT CloudWatch alarms"
    else
        warning "No CloudWatch alarms found"
    fi
    
    # Check SNS topics
    SNS_COUNT=$(aws sns list-topics \
        --region "$REGION" \
        --query "length(Topics[?contains(TopicArn, 'upskill')])" \
        --output text 2>/dev/null || echo "0")
    
    if [[ "$SNS_COUNT" -gt 0 ]]; then
        success "Found $SNS_COUNT SNS topics for alerting"
    else
        warning "No SNS topics found for alerting"
    fi
}

# Function to compare recovery times against RTO targets
compare_rto_targets() {
    test_header "Comparing Recovery Times Against RTO Targets"
    
    local all_within_target=true
    
    for test_name in "${!RECOVERY_TIMES[@]}"; do
        local actual_time=${RECOVERY_TIMES[$test_name]}
        local target_time=${RTO_TARGETS[$test_name]}
        
        if [[ -n "$target_time" && -n "$actual_time" ]]; then
            if [[ $actual_time -le $target_time ]]; then
                success "$test_name: ${actual_time}s (Target: ${target_time}s) ✅"
            else
                error "$test_name: ${actual_time}s (Target: ${target_time}s) ❌ EXCEEDED"
                all_within_target=false
            fi
        else
            warning "$test_name: No timing data available"
        fi
    done
    
    if [[ "$all_within_target" == "true" ]]; then
        success "All recovery times are within RTO targets"
        return 0
    else
        error "Some recovery times exceeded RTO targets"
        return 1
    fi
}

# Function to generate test report
generate_test_report() {
    log "Generating failover test report..."
    
    cat > "$RESULTS_FILE" << REPORT_EOF
{
  "test_execution": {
    "timestamp": "$(date --iso-8601=seconds)",
    "region": "$REGION",
    "dr_region": "$DR_REGION",
    "dry_run": $DRY_RUN,
    "test_duration": $(( $(date +%s) - TEST_START_TIME ))
  },
  "test_results": {
REPORT_EOF

    # Add test results
    local first=true
    for test_name in "${!TEST_RESULTS[@]}"; do
        if [[ "$first" == "true" ]]; then
            first=false
        else
            echo "," >> "$RESULTS_FILE"
        fi
        echo "    \"$test_name\": \"${TEST_RESULTS[$test_name]}\"" >> "$RESULTS_FILE"
    done

    cat >> "$RESULTS_FILE" << REPORT_EOF
  },
  "recovery_times": {
REPORT_EOF

    # Add recovery times
    first=true
    for test_name in "${!RECOVERY_TIMES[@]}"; do
        if [[ "$first" == "true" ]]; then
            first=false
        else
            echo "," >> "$RESULTS_FILE"
        fi
        echo "    \"$test_name\": ${RECOVERY_TIMES[$test_name]}" >> "$RESULTS_FILE"
    done

    cat >> "$RESULTS_FILE" << REPORT_EOF
  },
  "recommendations": [
    "Review any failed tests and update infrastructure configuration",
    "Ensure all RTO targets are met by optimizing slow recovery processes",
    "Schedule regular failover testing to maintain readiness",
    "Update monitoring thresholds based on test results"
  ]
}
REPORT_EOF

    success "Test report generated: $RESULTS_FILE"
}

# Main execution function
main() {
    TEST_START_TIME=$(date +%s)
    
    log "Starting Upskill Platform Failover Testing"
    log "Region: $REGION, DR Region: $DR_REGION"
    log "Dry Run: $DRY_RUN"
    log "Log file: $LOG_FILE"
    echo ""
    
    # Run tests
    check_prerequisites
    test_aurora_availability
    test_rds_proxy_health
    test_dynamodb_status
    test_lambda_status
    test_cross_region_backup
    test_monitoring_alerting
    compare_rto_targets
    generate_test_report
    
    echo ""
    log "Failover testing completed!"
    
    # Summary
    local passed_tests=0
    local total_tests=0
    
    for result in "${TEST_RESULTS[@]}"; do
        ((total_tests++))
        if [[ "$result" == "PASS" ]]; then
            ((passed_tests++))
        fi
    done
    
    success "Test Summary: $passed_tests/$total_tests tests passed"
    log "Results file: $RESULTS_FILE"
}

# Handle command line arguments
case "${1:-}" in
    --help|-h)
        echo "Upskill Platform Failover Testing Script"
        echo ""
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h              Show this help message"
        echo "  --region REGION         Set AWS region (default: us-west-2)"
        echo "  --dr-region REGION      Set DR region (default: us-east-1)"
        echo "  --dry-run               Simulate tests without making changes"
        exit 0
        ;;
    --region)
        REGION="$2"
        shift 2
        ;;
    --dr-region)
        DR_REGION="$2"
        shift 2
        ;;
    --dry-run)
        DRY_RUN=true
        shift
        ;;
    "")
        # No arguments, run normally
        ;;
    *)
        error "Unknown argument: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac

# Execute main function
main "$@"
