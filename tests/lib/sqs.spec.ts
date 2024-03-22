import 'dotenv/config';
import { SQS } from '../../src/lib/sqs';

const { AWS_SQS_QUEUE_TEST_QUEUE_1 } = process.env;

let sqs = new SQS(AWS_SQS_QUEUE_TEST_QUEUE_1 || '');

const clearQueue = async () => {
  const result = await sqs.recieiveMessages();
  if (!result || !result.Messages || result.Messages.length === 0) return;
  await Promise.all(
    result.Messages?.map(
      async message => await sqs.deleteMessage(message?.ReceiptHandle as string)
    ) || []
  );
};

describe('sqs', () => {
  describe('sendMessage', () => {
    afterAll(async () => {
      await clearQueue();
    });
    it('should send a message to the queue', async () => {
      const result = await sqs.sendMessage({ foo: 'bar' });
      expect(result['$metadata']).toHaveProperty('httpStatusCode', 200);
    });
  });
  describe('recieiveMessages', () => {
    beforeAll(async () => {
      await sqs.sendMessage({ foo: 'bar' });
    });
    afterAll(async () => {
      await clearQueue();
    });
    it('should recieve messages from the queue', async () => {
      const result = await sqs.recieiveMessages();
      expect(result['$metadata']).toHaveProperty('httpStatusCode', 200);
    });
  });
  describe('deleteMessage', () => {
    beforeAll(async () => {
      await sqs.sendMessage({ foo: 'bar' });
    });
    it('should delete a message from the queue', async () => {
      const result = await sqs.recieiveMessages();
      const receiptHandle = result.Messages?.[0].ReceiptHandle;
      if (receiptHandle) {
        const deleteResult = (await sqs.deleteMessage(receiptHandle)) || {};
        expect(deleteResult['$metadata']).toHaveProperty('httpStatusCode', 200);
      }
    });
  });
});
