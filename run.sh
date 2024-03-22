#!/bin/bash
docker compose run app "$@"
echo "Stopping localstack..."
docker compose stop localstack