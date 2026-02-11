import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

export class DynamoFactory {
  static createFullClient(configuration?: DynamoDBClientConfig): DynamoDB {
    return new DynamoDB(configuration ?? {});
  }
}
