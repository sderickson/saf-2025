#!/bin/bash

# Check which environment is currently active
if docker-compose -f docker-compose.blue.yml ps | grep -q "Up"; then
    CURRENT="blue"
    NEXT="green"
else
    CURRENT="green"
    NEXT="blue"
fi

echo "Current environment is $CURRENT, deploying to $NEXT"

# Start new environment
VERSION=$1 docker-compose -f docker-compose.$NEXT.yml up -d

# Wait for health checks
echo "Waiting for health checks..."
sleep 20

# Check if new environment is healthy
if ! docker-compose -f docker-compose.$NEXT.yml ps | grep -q "Up"; then
    echo "New environment failed to start. Rolling back..."
    docker-compose -f docker-compose.$NEXT.yml down
    exit 1
fi

# Update nginx config
sed -i "s/$CURRENT/$NEXT/" nginx.conf

# Reload nginx
docker-compose -f docker-compose.base.yml exec -T nginx nginx -s reload

# Wait for nginx to reload
sleep 5

# Take down old environment
docker-compose -f docker-compose.$CURRENT.yml down

echo "Deployment complete! New version running on $NEXT environment"