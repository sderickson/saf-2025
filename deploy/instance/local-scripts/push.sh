#!/bin/bash
# Push images to GitHub's Container Registry
docker push ghcr.io/sderickson/saf-2025-caddy:latest
docker push ghcr.io/sderickson/saf-2025-api:latest
docker push ghcr.io/sderickson/saf-2025-auth:latest
