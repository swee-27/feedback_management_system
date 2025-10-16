#!/bin/bash
# Usage: ./blue_green.sh feedback-system:latest

IMAGE=$1
ACTIVE=$(docker ps --filter "name=blue" --format "{{.Names}}")

if [ "$ACTIVE" == "blue" ]; then
    INACTIVE="green"
    OLD="blue"
else
    INACTIVE="blue"
    OLD="green"
fi

echo "Active: $ACTIVE, Deploying to: $INACTIVE"

# Stop previous inactive container if exists
docker rm -f $INACTIVE || true

# Run new version on the inactive container
docker run -d -p 3001:3000 --name $INACTIVE $IMAGE

# Optional: wait for health check
sleep 10
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [ $STATUS -ne 200 ]; then
  echo "Smoke test failed, aborting deployment"
  docker rm -f $INACTIVE
  exit 1
fi

# Stop old container and swap ports
docker stop $OLD || true
docker rm -f $OLD || true

docker rename $INACTIVE $OLD
docker run -d -p 3000:3000 --name $OLD $IMAGE

echo "Deployment complete: $OLD is now live"