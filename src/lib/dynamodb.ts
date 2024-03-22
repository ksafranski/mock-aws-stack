import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import {
  PutCommand,
  QueryCommand,
  DynamoDBDocumentClient,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';

export class DynamoDB {
  client: DynamoDBClient;
  docClient: DynamoDBDocumentClient;

  constructor() {
    this.client = new DynamoDBClient({
      region: process.env.AWS_DEFAULT_REGION,
      endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
    });
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  async listTables(): Promise<string[]> {
    const command = new ListTablesCommand({});
    const response = await this.client.send(command);
    return response.TableNames || [];
  }

  async putItem(table: string, item: object): Promise<any> {
    const input = {
      TableName: table,
      Item: item,
    };
    const command = new PutCommand(input);
    return await this.docClient.send(command);
  }

  async query(
    table: string,
    query: Omit<QueryCommandInput, 'TableName'>
  ): Promise<any> {
    const input = {
      TableName: table,
      ...query,
    };
    const command = new QueryCommand(input);
    return await this.docClient.send(command);
  }
}
