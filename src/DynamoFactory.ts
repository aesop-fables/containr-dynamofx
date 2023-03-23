import { DynamoDB } from 'aws-sdk';

export class DynamoFactory {
  static createFullClient(configuration?: DynamoDB.Types.ClientConfiguration): DynamoDB {
    return new DynamoDB(configuration ?? {});
  }
}
