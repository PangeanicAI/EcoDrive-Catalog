#!/bin/bash

# Script to build and push Docker image to AWS ECR
# Usage: ./scripts/push-to-ecr.sh [AWS_REGION] [ECR_REPOSITORY_NAME]
#
# Example: ./scripts/push-to-ecr.sh us-east-1 ecodrive-catalog

set -e

# Configuration
AWS_REGION=${1:-"us-east-1"}
ECR_REPO_NAME=${2:-"ecodrive-catalog"}
IMAGE_TAG=${3:-"latest"}

echo "🚀 Starting Docker image build and push to AWS ECR"
echo "=================================================="
echo "AWS Region: $AWS_REGION"
echo "ECR Repository: $ECR_REPO_NAME"
echo "Image Tag: $IMAGE_TAG"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ Error: AWS CLI is not installed"
    echo "Please install AWS CLI: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Error: Docker is not running"
    echo "Please start Docker and try again"
    exit 1
fi

# Get AWS account ID
echo "🔍 Getting AWS account ID..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo "❌ Error: Could not get AWS account ID"
    echo "Please check your AWS credentials"
    exit 1
fi

echo "✅ AWS Account ID: $AWS_ACCOUNT_ID"

# Construct ECR repository URI
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

echo ""
echo "🔐 Authenticating Docker with AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to authenticate with ECR"
    exit 1
fi

echo "✅ Docker authenticated successfully"

# Check if ECR repository exists, create if it doesn't
echo ""
echo "🔍 Checking if ECR repository exists..."
if ! aws ecr describe-repositories --repository-names $ECR_REPO_NAME --region $AWS_REGION &> /dev/null; then
    echo "⚠️  Repository does not exist. Creating..."
    aws ecr create-repository \
        --repository-name $ECR_REPO_NAME \
        --region $AWS_REGION \
        --image-scanning-configuration scanOnPush=true \
        --encryption-configuration encryptionType=AES256

    echo "✅ Repository created successfully"
else
    echo "✅ Repository already exists"
fi

# Build Docker image
echo ""
echo "🔨 Building Docker image..."
docker build -t $ECR_REPO_NAME:$IMAGE_TAG .

if [ $? -ne 0 ]; then
    echo "❌ Error: Docker build failed"
    exit 1
fi

echo "✅ Docker image built successfully"

# Tag image for ECR
echo ""
echo "🏷️  Tagging image for ECR..."
docker tag $ECR_REPO_NAME:$IMAGE_TAG $ECR_URI:$IMAGE_TAG
docker tag $ECR_REPO_NAME:$IMAGE_TAG $ECR_URI:$(date +%Y%m%d-%H%M%S)

echo "✅ Image tagged successfully"

# Push to ECR
echo ""
echo "📤 Pushing image to ECR..."
docker push $ECR_URI:$IMAGE_TAG
docker push $ECR_URI:$(date +%Y%m%d-%H%M%S)

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to push image to ECR"
    exit 1
fi

echo ""
echo "✅ Image pushed successfully to ECR!"
echo "=================================================="
echo "ECR Repository URI: $ECR_URI"
echo "Image Tag (latest): $ECR_URI:$IMAGE_TAG"
echo "Image Tag (dated): $ECR_URI:$(date +%Y%m%d-%H%M%S)"
echo ""
echo "To pull this image:"
echo "  docker pull $ECR_URI:$IMAGE_TAG"
echo ""
echo "To deploy with ECS or other AWS services, use:"
echo "  $ECR_URI:$IMAGE_TAG"
