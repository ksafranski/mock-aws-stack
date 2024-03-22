import {
  SNSClient,
  PublishCommand,
  PublishCommandOutput,
} from '@aws-sdk/client-sns';

export class SNS {
  client: SNSClient;
  topicArn: string;

  constructor(topicArn: string) {
    this.topicArn = topicArn;
    this.client = new SNSClient({
      region: process.env.AWS_DEFAULT_REGION,
      endpoint: process.env.AWS_SNS_ENDPOINT,
    });
  }

  async publishMessage(
    message: string | object
  ): Promise<PublishCommandOutput> {
    const input = {
      Message: message === typeof 'string' ? message : JSON.stringify(message),
      TopicArn: this.topicArn,
    };
    const command = new PublishCommand(input);
    return await this.client.send(command);
  }
}
