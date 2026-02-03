#!/bin/bash

# Script to deploy Docker image to AWS ECS
# Usage: ./scripts/deploy-ecs.sh [AWS_REGION] [CLUSTER_NAME] [SERVICE_NAME]
#
# Prerequisites:
# - ECR repository with the image
# - ECS cluster created
# - Task definition registered
# - Service created
#
# Example: ./scripts/deploy-ecs.sh us-east-1 ecodrive-cluster ecodrive-catalog-service

set -e

# Configuration
AWS_REGION=${1:-"us-east-1"}
CLUSTER_NAME=${2:-"ecodrive-cluster"}
SERVICE_NAME=${3:-"ecodrive-catalog-service"}

echo "🚀 Deploying to AWS ECS"
echo "=================================================="
echo "AWS Region: $AWS_REGION"
echo "ECS Cluster: $CLUSTER_NAME"
echo "ECS Service: $SERVICE_NAME"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ Error: AWS CLI is not installed"
    exit 1
fi

# Force new deployment
echo "🔄 Forcing new deployment..."
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --force-new-deployment \
    --region $AWS_REGION

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to update ECS service"
    exit 1
fi

echo ""
echo "✅ Deployment initiated successfully!"
echo ""
echo "Monitor deployment status:"
echo "  aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION"
echo ""
echo "View logs:"
echo "  aws logs tail /ecs/$SERVICE_NAME --follow --region $AWS_REGION"
