#!/bin/bash

cd /root/saf-2025/deploy/instance/remote-assets
docker compose --env-file .env.prod -f docker-compose.prod.yaml down