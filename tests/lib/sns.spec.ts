import 'dotenv/config';
import { SNS } from '../../src/lib/sns';

const { AWS_SNS_TOPIC_TEST_TOPIC_1 } = process.env;

describe('SNS', () => {
  describe('publishMessage', () => {
    it('should publish a message to the topic', async () => {
      const sns = new SNS(AWS_SNS_TOPIC_TEST_TOPIC_1 || '');
      const result = await sns.publishMessage({ foo: 'bar' });
      expect(result['$metadata']).toHaveProperty('httpStatusCode', 200);
    });
  });
});
