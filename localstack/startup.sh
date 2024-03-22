#!/bin/bash

# Set up the AWS CLI to use the localstack profile, configuration
aws configure set aws_access_key_id "local" --profile localstack
aws configure set aws_secret_access_key "local" --profile localstack
aws configure set region "es-east-1" --profile localstack
aws configure set output "text" --profile localstack

# Statics
base_aws_endpoint="http://localstack:4566"
base_sns_arn="arn:aws:sns:us-east-1:000000000000:"
base_sqs_url="$base_aws_endpoint/000000000000/"
base_sns_url="$base_aws_endpoint/000000000000/"
base_dynamodb_arn="arn:aws:dynamodb:us-east-1:000000000000:table/"
base_dynamodb_url="$base_aws_endpoint/000000000000/"

# Reset env file
rm .env
touch .env

echo AWS_ACCESS_KEY_ID=local | tee -a .env
echo AWS_SECRET_ACCESS_KEY=local | tee -a .env
echo AWS_DEFAULT_REGION=us-east-1 | tee -a .env
echo AWS_SQS_ENDPOINT="$base_sqs_url" | tee -a .env
echo AWS_SNS_ENDPOINT="$base_sns_url" | tee -a .env
echo AWS_DYNAMODB_ENDPOINT="$base_dynamodb_url" | tee -a .env
echo AWS_S3_ENDPOINT="$base_aws_endpoint" | tee -a .env

# Create SNS Topics
echo "Creating SNS Topics..."
for config in ./localstack/sns_topics/*.json; do
  name=$(basename -- "${config%.*}")
  aws --endpoint-url=http://localstack:4566 sns create-topic \
    --name "$name" \
    --region us-east-1 \
    --profile localstack
  
  # Set environment variables
  name_upper=$(echo "$name" | tr '[a-z]' '[A-Z]')
  env_name="AWS_SNS_TOPIC_${name_upper}"
  echo $env_name="$base_sns_arn$name" | tee -a .env
done

# Create SQS Queues
echo "Creating SQS Queues..."
for config in ./localstack/sqs_queues/*.json; do
  name=$(basename -- "${config%.*}")
  aws --endpoint-url=http://localstack:4566 sqs create-queue \
    --queue-name "$name" \
    --region us-east-1 \
    --profile localstack \
    --attributes file://$config

  # Set environment variables
  name_upper=$(echo "$name" | tr '[a-z]' '[A-Z]')
  env_name="AWS_SQS_QUEUE_${name_upper}"
  echo $env_name="$base_sqs_url$name" | tee -a .env
done

# Create SQS Queues
echo "Creating DynamoDB Tables..."
for config in ./localstack/dynamodb_tables/*.json; do
  name=$(basename -- "${config%.*}")
  aws --endpoint-url=http://localstack:4566 dynamodb create-table \
    --cli-input-json file://$config \
    --region us-east-1 \
    --profile localstack

  # Set environment variables
  name_upper=$(echo "$name" | tr '[a-z]' '[A-Z]')
  env_name="AWS_DYNAMODB_TABLE_${name_upper}"
  echo $env_name="$base_dynamodb_arn$name" | tee -a .env
done

# Create S3 Buckets
echo "Creating S3 Buckets..."
for config in ./localstack/s3_buckets/*.json; do
  name=$(basename -- "${config%.*}")
  uri=$(echo "$name" | tr '_' '-') # Replace _ with -
  aws --endpoint-url=http://localstack:4566 s3api create-bucket \
    --bucket "$uri" \
    --cli-input-json file://$config \
    --region us-east-1 \
    --profile localstack

  # Set environment variables
  name_upper=$(echo "$name" | tr '[a-z]' '[A-Z]')
  env_name="AWS_S3_BUCKET_${name_upper}"
  echo $env_name="$name" | tee -a .env
done
