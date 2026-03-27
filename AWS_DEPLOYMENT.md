# AWS Deployment Guide - EcoDrive Catalog

This guide explains how to build, push, and deploy the EcoDrive Catalog application to AWS using ECR and ECS.

## 📋 Prerequisites

1. **AWS CLI** installed and configured

   ```bash
   aws --version
   aws configure
   ```

2. **Docker** installed and running

   ```bash
   docker --version
   ```

3. **AWS Credentials** configured with appropriate permissions:
   - ECR: `ecr:*`
   - ECS: `ecs:*` (for deployment)
   - IAM: `iam:PassRole` (for ECS task execution)

## 🐳 Option 1: Build and Test Locally

### Build Docker Image

```bash
# Make script executable
chmod +x scripts/build-docker.sh

# Build the image
./scripts/build-docker.sh
```

### Test Locally

```bash
# Run with Docker
docker run -p 3000:3000 -e CATALOG_API_URL=http://ecodrive.pangeanic.com:19195 ecodrive-catalog:latest

# Or use Docker Compose
docker-compose up
```

Visit http://localhost:3000 to verify the application works.

## 📦 Option 2: Push to AWS ECR

### Quick Push to ECR

```bash
# Make script executable
chmod +x scripts/push-to-ecr.sh

# Push to ECR (will create repository if it doesn't exist)
./scripts/push-to-ecr.sh us-east-1 ecodrive-catalog latest
```

### Manual Push to ECR

1. **Authenticate Docker with ECR**

   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
   ```

2. **Create ECR Repository** (if it doesn't exist)

   ```bash
   aws ecr create-repository \
       --repository-name ecodrive-catalog \
       --region us-east-1 \
       --image-scanning-configuration scanOnPush=true \
       --encryption-configuration encryptionType=AES256
   ```

3. **Build and Tag Image**

   ```bash
   # Build
   docker build -t ecodrive-catalog:latest .

   # Tag for ECR
   docker tag ecodrive-catalog:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecodrive-catalog:latest
   ```

4. **Push to ECR**
   ```bash
   docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecodrive-catalog:latest
   ```

## 🚀 Option 3: Deploy to AWS ECS

### Prerequisites for ECS Deployment

1. **Create ECS Cluster**

   ```bash
   aws ecs create-cluster --cluster-name ecodrive-cluster --region us-east-1
   ```

2. **Create Task Execution Role**

   ```bash
   aws iam create-role \
       --role-name ecsTaskExecutionRole \
       --assume-role-policy-document file://task-execution-role.json

   aws iam attach-role-policy \
       --role-name ecsTaskExecutionRole \
       --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
   ```

3. **Register Task Definition**

Create `task-definition.json`:

```json
{
  "family": "ecodrive-catalog",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "ecodrive-catalog",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecodrive-catalog:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "CATALOG_API_URL",
          "value": "http://ecodrive.pangeanic.com:19195"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ecodrive-catalog",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Register the task definition:

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

4. **Create ECS Service**
   ```bash
   aws ecs create-service \
       --cluster ecodrive-cluster \
       --service-name ecodrive-catalog-service \
       --task-definition ecodrive-catalog \
       --desired-count 1 \
       --launch-type FARGATE \
       --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
       --region us-east-1
   ```

### Deploy Using Script

```bash
# Make script executable
chmod +x scripts/deploy-ecs.sh

# Deploy
./scripts/deploy-ecs.sh us-east-1 ecodrive-cluster ecodrive-catalog-service
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS ECR and ECS

on:
  push:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: ecodrive-catalog
  ECS_CLUSTER: ecodrive-cluster
  ECS_SERVICE: ecodrive-catalog-service

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push image to Amazon ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Deploy to Amazon ECS
        run: |
          aws ecs update-service \
            --cluster ${{ env.ECS_CLUSTER }} \
            --service ${{ env.ECS_SERVICE }} \
            --force-new-deployment
```

## 📊 Monitoring and Logs

### View CloudWatch Logs

```bash
# Create log group (if not exists)
aws logs create-log-group --log-group-name /ecs/ecodrive-catalog --region us-east-1

# Tail logs
aws logs tail /ecs/ecodrive-catalog --follow --region us-east-1
```

### Check ECS Service Status

```bash
aws ecs describe-services \
    --cluster ecodrive-cluster \
    --services ecodrive-catalog-service \
    --region us-east-1
```

### List Running Tasks

```bash
aws ecs list-tasks \
    --cluster ecodrive-cluster \
    --service-name ecodrive-catalog-service \
    --region us-east-1
```

## 🔧 Troubleshooting

### Image Build Issues

```bash
# Check Docker logs
docker logs <container_id>

# Rebuild without cache
docker build --no-cache -t ecodrive-catalog:latest .
```

### ECR Authentication Issues

```bash
# Re-authenticate
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

### ECS Deployment Issues

```bash
# Check task events
aws ecs describe-tasks \
    --cluster ecodrive-cluster \
    --tasks <task-id> \
    --region us-east-1
```

## 💰 Cost Optimization

1. **Use Fargate Spot** for non-production environments
2. **Enable auto-scaling** based on CPU/Memory usage
3. **Set up lifecycle policies** for ECR to delete old images
4. **Use CloudWatch alarms** to monitor costs

### ECR Lifecycle Policy Example

```json
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep last 10 images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
```

Apply the policy:

```bash
aws ecr put-lifecycle-policy \
    --repository-name ecodrive-catalog \
    --lifecycle-policy-text file://lifecycle-policy.json \
    --region us-east-1
```

## 🔐 Security Best Practices

1. **Use IAM roles** instead of access keys when possible
2. **Enable ECR image scanning** (already enabled in scripts)
3. **Use secrets manager** for sensitive environment variables
4. **Enable encryption** for ECR repositories (already enabled)
5. **Use private subnets** with NAT Gateway for ECS tasks
6. **Implement WAF** if using Application Load Balancer

## 📚 Additional Resources

- [AWS ECR Documentation](https://docs.aws.amazon.com/ecr/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [AWS CLI Reference](https://docs.aws.amazon.com/cli/)
