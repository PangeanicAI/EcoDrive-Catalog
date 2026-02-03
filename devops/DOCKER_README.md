# 🐳 Docker & AWS ECR Deployment Guide

Complete guide to containerize and deploy the EcoDrive Catalog application.

## 📦 Quick Start

### Local Development with Docker

```bash
# Build the image
docker build -t ecodrive-catalog:latest .

# Run the container
docker run -p 3000:3000 \
  -e CATALOG_API_URL=http://ecodrive.pangeanic.com:19195 \
  ecodrive-catalog:latest

# Or use docker-compose
docker-compose up
```

Visit http://localhost:3000

## 🚀 Deploy to AWS ECR

### Prerequisites

1. **Install AWS CLI**

   ```bash
   # macOS
   brew install awscli

   # Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```

2. **Configure AWS Credentials**

   ```bash
   aws configure
   # Enter your:
   # - AWS Access Key ID
   # - AWS Secret Access Key
   # - Default region (e.g., us-east-1)
   # - Default output format (json)
   ```

3. **Verify Docker is running**
   ```bash
   docker --version
   docker info
   ```

### Method 1: Automated Script (Recommended)

```bash
# Make script executable
chmod +x scripts/push-to-ecr.sh

# Push to ECR (creates repository if needed)
./scripts/push-to-ecr.sh us-east-1 ecodrive-catalog latest
```

The script will:

- ✅ Authenticate Docker with AWS ECR
- ✅ Create ECR repository if it doesn't exist
- ✅ Build the Docker image
- ✅ Tag the image with `latest` and timestamp
- ✅ Push both tags to ECR

### Method 2: Manual Steps

```bash
# 1. Get your AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo $AWS_ACCOUNT_ID

# 2. Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# 3. Create ECR repository (if it doesn't exist)
aws ecr create-repository \
  --repository-name ecodrive-catalog \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256

# 4. Build the image
docker build -t ecodrive-catalog:latest .

# 5. Tag for ECR
docker tag ecodrive-catalog:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecodrive-catalog:latest

# 6. Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ecodrive-catalog:latest
```

## 📋 Docker Configuration

### Dockerfile Structure

The Dockerfile uses a **multi-stage build** for optimization:

1. **Stage 1 (deps)**: Install production dependencies
2. **Stage 2 (builder)**: Build the Next.js application
3. **Stage 3 (runner)**: Create minimal production image

Benefits:

- 🎯 Smaller image size (~150MB vs ~1GB)
- 🔒 Better security (only production files)
- ⚡ Faster deployments

### Environment Variables

Configure via environment variables:

```bash
# Required
CATALOG_API_URL=http://ecodrive.pangeanic.com:19195

# Optional
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

### Docker Compose

For local development:

```yaml
# docker-compose.yml
services:
  ecodrive-catalog:
    build: .
    ports:
      - "3000:3000"
    environment:
      - CATALOG_API_URL=http://ecodrive.pangeanic.com:19195
```

Run with:

```bash
docker-compose up
docker-compose down
```

## 🔧 Available Scripts

### Build Docker Image

```bash
./scripts/build-docker.sh
```

### Push to ECR

```bash
./scripts/push-to-ecr.sh [region] [repository] [tag]

# Examples:
./scripts/push-to-ecr.sh us-east-1 ecodrive-catalog latest
./scripts/push-to-ecr.sh eu-west-1 ecodrive-catalog v1.0.0
```

### Deploy to ECS

```bash
./scripts/deploy-ecs.sh [region] [cluster] [service]

# Example:
./scripts/deploy-ecs.sh us-east-1 ecodrive-cluster ecodrive-catalog-service
```

## 🎯 AWS ECS Deployment

### 1. Create ECS Cluster

```bash
aws ecs create-cluster \
  --cluster-name ecodrive-cluster \
  --region us-east-1
```

### 2. Create Task Execution Role

```bash
# Create role
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://task-execution-role.json

# Attach policy
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

### 3. Register Task Definition

Edit `task-definition.example.json` with your account ID, then:

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.example.json
```

### 4. Create ECS Service

```bash
aws ecs create-service \
  --cluster ecodrive-cluster \
  --service-name ecodrive-catalog-service \
  --task-definition ecodrive-catalog \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={
    subnets=[subnet-xxxxx],
    securityGroups=[sg-xxxxx],
    assignPublicIp=ENABLED
  }" \
  --region us-east-1
```

### 5. Update Service (Deploy New Version)

```bash
# Using script
./scripts/deploy-ecs.sh us-east-1 ecodrive-cluster ecodrive-catalog-service

# Or manually
aws ecs update-service \
  --cluster ecodrive-cluster \
  --service ecodrive-catalog-service \
  --force-new-deployment \
  --region us-east-1
```

## 📊 Monitoring

### View ECR Images

```bash
aws ecr list-images \
  --repository-name ecodrive-catalog \
  --region us-east-1
```

### Check ECS Service Status

```bash
aws ecs describe-services \
  --cluster ecodrive-cluster \
  --services ecodrive-catalog-service \
  --region us-east-1
```

### View CloudWatch Logs

```bash
# Tail logs
aws logs tail /ecs/ecodrive-catalog --follow --region us-east-1

# Get last 1 hour of logs
aws logs tail /ecs/ecodrive-catalog --since 1h --region us-east-1
```

### List Running Tasks

```bash
aws ecs list-tasks \
  --cluster ecodrive-cluster \
  --service-name ecodrive-catalog-service \
  --region us-east-1
```

## 🔍 Troubleshooting

### Build Issues

```bash
# Check Docker daemon
docker info

# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t ecodrive-catalog:latest .
```

### ECR Authentication Issues

```bash
# Re-authenticate
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Check credentials
aws sts get-caller-identity
```

### ECS Task Failures

```bash
# Get task details
aws ecs describe-tasks \
  --cluster ecodrive-cluster \
  --tasks TASK_ID \
  --region us-east-1

# Check stopped tasks
aws ecs list-tasks \
  --cluster ecodrive-cluster \
  --desired-status STOPPED \
  --region us-east-1
```

### Container Won't Start

Check logs:

```bash
# Via AWS CLI
aws logs tail /ecs/ecodrive-catalog --follow

# Via Docker (local testing)
docker logs CONTAINER_ID
docker logs --follow CONTAINER_ID
```

Common issues:

- ❌ Port already in use: Change port mapping
- ❌ ENV vars missing: Check task definition
- ❌ Image not found: Verify ECR URI
- ❌ Memory issues: Increase memory in task definition

## 💡 Best Practices

### Security

- ✅ Use ECR image scanning
- ✅ Enable encryption (AES256)
- ✅ Run container as non-root user
- ✅ Use secrets for sensitive data
- ✅ Keep base images updated

### Performance

- ✅ Use multi-stage builds
- ✅ Minimize layer count
- ✅ Use .dockerignore
- ✅ Cache npm dependencies
- ✅ Use production mode

### Cost Optimization

- ✅ Use Fargate Spot for dev/test
- ✅ Set ECR lifecycle policies
- ✅ Enable auto-scaling
- ✅ Monitor CloudWatch costs
- ✅ Clean up unused images

### CI/CD

- ✅ Automate builds with GitHub Actions
- ✅ Tag images with git SHA
- ✅ Use health checks
- ✅ Enable rollback on failure
- ✅ Test locally before deploying

## 📚 Additional Resources

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [AWS ECR User Guide](https://docs.aws.amazon.com/ecr/)
- [AWS ECS Developer Guide](https://docs.aws.amazon.com/ecs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Full AWS Deployment Guide](./AWS_DEPLOYMENT.md)

## ❓ Need Help?

Check the comprehensive [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) for:

- Detailed ECS setup
- GitHub Actions CI/CD
- Cost optimization strategies
- Advanced troubleshooting
- Production best practices
