# This script will build all production-required images and push them to GitHub's Container Registry.
# Run from the root directory of the repository.

# Build dependent images
docker build -t saf-clients:latest -f ./clients/Dockerfile . --platform linux/amd64

# Build production images
docker build -t ghcr.io/sderickson/saf-caddy:latest -f ./deploy/instance/Dockerfile.prod --platform linux/amd64 .
docker build -t ghcr.io/sderickson/saf-services-api:latest -f ./services/api/Dockerfile . --platform linux/amd64
docker build -t ghcr.io/sderickson/saf-services-auth:latest -f ./services/auth/Dockerfile . --platform linux/amd64

# Push images to GitHub's Container Registry
docker push ghcr.io/sderickson/saf-caddy:latest
docker push ghcr.io/sderickson/saf-services-api:latest
docker push ghcr.io/sderickson/saf-services-auth:latest
