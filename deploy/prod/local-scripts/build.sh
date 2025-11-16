#!/bin/bash
set -e

# Build dependent images
docker build -t saf-docs-client:latest -f ./clients/saf-docs/Dockerfile . --platform linux/amd64
docker build -t workflow-docs-client:latest -f ./clients/workflow-docs/Dockerfile . --platform linux/amd64

# Build production images
docker build -t ghcr.io/sderickson/saf-2025-caddy:latest -f ./deploy/prod/Dockerfile.prod . --platform linux/amd64

# Note: sometimes need to run with --no-cache if cache got into a weird state from cancelling mid-build