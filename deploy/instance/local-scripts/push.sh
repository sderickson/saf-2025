#!/bin/bash
# Push images to GitHub's Container Registry
docker push ghcr.io/sderickson/saf-caddy:latest
docker push ghcr.io/sderickson/saf-services-api:latest
docker push ghcr.io/sderickson/saf-services-auth:latest
