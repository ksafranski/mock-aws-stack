import 'dotenv/config';
import { S3 } from '../../src/lib/s3';

const bucket = 'test-bucket';

describe('S3', () => {
  describe('listBuckets', () => {
    it('should list the buckets', async () => {
      const s3 = new S3();
      const result = await s3.listBuckets();
      expect(result['$metadata'].httpStatusCode).toBe(200);
      expect(result.Buckets).toEqual(
        expect.arrayContaining([expect.objectContaining({ Name: bucket })])
      );
    });
  });
  describe('putObject', () => {
    it('should put an object in the bucket', async () => {
      const s3 = new S3();
      const key = 'test.txt';
      const body = 'Hello, World!';
      const result = await s3.putObject(bucket, key, body);
      expect(result['$metadata'].httpStatusCode).toBe(200);
    });
  });
  describe('getObject', () => {
    it('should get an object from the bucket', async () => {
      const s3 = new S3();
      const key = 'test.txt';
      const result = await s3.getObject(bucket, key);
      expect(result['$metadata'].httpStatusCode).toBe(200);
    });
  });
});
