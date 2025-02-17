# This script will build all production-required images and push them to GitHub's Container Registry.
# Run from the root directory of the repository.

# Build dependent images
docker build -t saf-clients:latest -f ./clients/Dockerfile .

# Build production images
docker build -t ghcr.io/sderickson/saf-caddy:latest -f ./deploy/instance/Dockerfile.prod .
docker build -t ghcr.io/sderickson/saf-services-api:latest -f ./services/api/Dockerfile .
docker build -t ghcr.io/sderickson/saf-services-auth:latest -f ./services/auth/Dockerfile .

# Push images to GitHub's Container Registry
docker push ghcr.io/sderickson/saf-caddy:latest
docker push ghcr.io/sderickson/saf-specs-apis:latest
docker push ghcr.io/sderickson/saf-services-auth:latest
