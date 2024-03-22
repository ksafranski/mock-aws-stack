import {
  S3Client,
  ListBucketsCommand,
  ListBucketsCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  PutObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandOutput,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';

export class S3 {
  client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
      endpoint: process.env.AWS_S3_ENDPOINT, // This is the localstack EDGE_PORT
      forcePathStyle: true,
    });
  }

  async listBuckets(): Promise<ListBucketsCommandOutput> {
    return await this.client.send(new ListBucketsCommand({}));
  }

  async putObject(
    bucket: string,
    key: string,
    body: string,
    options?: Omit<PutObjectCommandInput, 'Bucket' | 'Key' | 'Body'>
  ): Promise<PutObjectCommandOutput> {
    return await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ...options,
      })
    );
  }

  async getObject(
    bucket: string,
    key: string,
    options?: Omit<GetObjectCommandInput, 'Bucket' | 'Key'>
  ): Promise<GetObjectCommandOutput> {
    return await this.client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
        ...options,
      })
    );
  }
}
