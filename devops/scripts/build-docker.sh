#!/bin/bash

# Script to build Docker image locally
# Usage: ./scripts/build-docker.sh

set -e

echo "🔨 Building Docker image for EcoDrive Catalog..."

# Build the image
docker build -t ecodrive-catalog:latest .

echo "✅ Docker image built successfully!"
echo ""
echo "To run the container locally:"
echo "  docker run -p 3000:3000 ecodrive-catalog:latest"
echo ""
echo "Or use docker-compose:"
echo "  docker-compose up"
