#!/bin/bash
docker compose stop localstack
docker compose run app "$@"