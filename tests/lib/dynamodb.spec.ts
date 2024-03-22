import 'dotenv/config';
import { DynamoDB } from '../../src/lib/dynamodb';

const genRandomString = () => Math.random().toString(36).substring(7);

describe('DynamoDB', () => {
  describe('putItem', () => {
    it('should put an item in the table', async () => {
      const db = new DynamoDB();
      const result = await db.putItem('Test', {
        Foo: genRandomString(),
        Bar: 'bar',
      });
      expect(result['$metadata']).toHaveProperty('httpStatusCode', 200);
    });
  });
  describe('listTables', () => {
    it('should list the tables', async () => {
      const db = new DynamoDB();
      const result = await db.listTables();
      expect(result).toContain('Test');
    });
  });
  describe('query', () => {
    it('should query the table', async () => {
      const rando = genRandomString();
      const db = new DynamoDB();
      await db.putItem('Test', {
        Foo: genRandomString(),
        Bar: 'bar',
      });
      const result = await db.query('Test', {
        KeyConditionExpression: 'Foo = :foo',
        ExpressionAttributeValues: {
          ':foo': rando,
        },
      });
      expect(result['$metadata']).toHaveProperty('httpStatusCode', 200);
    });
  });
});
