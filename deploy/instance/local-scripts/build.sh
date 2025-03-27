#!/bin/bash
# Build dependent images
docker build -t saf-2025-clients:latest -f ./clients/Dockerfile . --platform linux/amd64

# Build production images
docker build -t ghcr.io/sderickson/saf-2025-caddy:latest -f ./deploy/instance/Dockerfile.prod --platform linux/amd64 .
docker build -t ghcr.io/sderickson/saf-2025-api:latest -f ./services/api/Dockerfile . --platform linux/amd64
docker build -t ghcr.io/sderickson/saf-2025-auth:latest -f ./saflib/auth-service/Dockerfile . --platform linux/amd64