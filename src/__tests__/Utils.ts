import { createContainer, IServiceContainer } from '@aesop-fables/containr';
import { useDynamo } from '..';
import { CreateTableInput, DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

class TableFactory {
  readonly tableName: string;

  constructor(private readonly params: CreateTableInput) {
    this.tableName = params.TableName ?? '';
    if (!this.tableName || !this.tableName.length) {
      throw new Error('Table name not specified');
    }
  }

  async createTable(dynamoDb: DynamoDB): Promise<void> {
    await dynamoDb.createTable(this.params);
  }

  async deleteTable(dynamoDb: DynamoDB): Promise<void> {
    await dynamoDb.deleteTable({ TableName: this.tableName });
  }
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

export interface SystemStateExpression {
  people: Person[];
}

const TableName = 'DynamoFxTester';

const params: CreateTableInput = {
  TableName,
  KeySchema: [
    {
      AttributeName: 'pk',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'key',
      KeyType: 'RANGE',
    },
  ],

  AttributeDefinitions: [
    {
      AttributeName: 'pk',
      AttributeType: 'S',
    },
    {
      AttributeName: 'key',
      AttributeType: 'S',
    },
  ],

  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

const settingsFactory = new TableFactory(params);


const endpoint = process.env.DYNAMO_DB_ENDPOINT || 'http://localhost:8000';
const options: DynamoDBClientConfig = { endpoint, region: 'us-west-2', credentials: { accessKeyId: 'TEST', secretAccessKey: 'TEST' } };
const dynamoDb = new DynamoDB(options);

async function clearDatabase() {
  try {
    await settingsFactory.deleteTable(dynamoDb);
  } catch (e) {
    console.log(JSON.stringify(e));
  }
}

async function buildDatabase() {
  await settingsFactory.createTable(dynamoDb);
}

export async function resetDatabase() {
  await clearDatabase();
  await buildDatabase();
}

async function savePerson(person: Person): Promise<void> {
  await dynamoDb
    .putItem({
      TableName,
      Item: {
        pk: {
          S: `PERSON#${person.id}`,
        },
        key: {
          S: `PERSON#${person.id}#INFO`,
        },
        id: {
          S: person.id,
        },
        firstName: {
          S: person.firstName,
        },
        lastName: {
          S: person.lastName,
        },
      },
    });
}

export async function executeExpression(expression: SystemStateExpression): Promise<void> {
  const { people } = expression;
  for (let i = 0; i < people.length; i++) {
    const person = people[i];
    await savePerson(person);
  }
}

export async function resetSystemState(expression: SystemStateExpression): Promise<IServiceContainer> {
  await resetDatabase();
  await executeExpression(expression);

  const container = createContainer([useDynamo({ endpoint })]);

  return container;
}
