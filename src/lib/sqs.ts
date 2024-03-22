import {
  SQSClient,
  SendMessageCommand,
  SendMessageResult,
  ReceiveMessageCommand,
  SendMessageCommandInput,
  ReceiveMessageCommandInput,
  DeleteMessageCommand,
  DeleteMessageBatchResult,
  ReceiveMessageResult,
} from '@aws-sdk/client-sqs';

export class SQS {
  queueUrl: string;
  client: SQSClient;

  constructor(queueUrl: string) {
    this.queueUrl = queueUrl;
    this.client = new SQSClient({
      region: process.env.AWS_DEFAULT_REGION,
      endpoint: process.env.AWS_SQS_ENDPOINT,
    });
  }
  async sendMessage(
    message: string | object,
    options?: Omit<SendMessageCommandInput, 'QueueUrl' | 'MessageBody'>
  ): Promise<SendMessageResult> {
    const input = {
      QueueUrl: this.queueUrl,
      MessageBody:
        message === typeof 'string' ? message : JSON.stringify(message),
    };
    const command = new SendMessageCommand({ ...input, ...options });
    return await this.client.send(command);
  }

  async recieiveMessages(
    options?: Omit<ReceiveMessageCommandInput, 'QueueUrl'>
  ): Promise<ReceiveMessageResult> {
    // Set sane defaults
    options = {
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 10,
      ...options,
    };
    const input = {
      QueueUrl: this.queueUrl,
    };
    const command = new ReceiveMessageCommand({ ...input, ...options });
    return await this.client.send(command);
  }
  async deleteMessage(
    receiptHandle: string
  ): Promise<DeleteMessageBatchResult | unknown> {
    const command = new DeleteMessageCommand({
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    });
    return await this.client.send(command);
  }
}
