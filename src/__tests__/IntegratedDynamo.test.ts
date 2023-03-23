import 'reflect-metadata';
import { inject } from '@aesop-fables/containr';
import { DynamoDB } from 'aws-sdk';
import { DynamoServices } from '../DynamoServices';
import { IDynamoOperation } from '../IDynamoOperation';
import { IDynamoService } from '../IDynamoService';
import { Person, resetSystemState } from './Utils';

class ListAllPeople implements IDynamoOperation<Person[]> {
  constructor(@inject(DynamoServices.Client) private readonly dynamo: DynamoDB) {}
  async execute(): Promise<Person[]> {
    const results = await this.dynamo.scan({ TableName: 'DynamoFxTester' }).promise();
    if (!results.Items) {
      return [];
    }

    return results.Items.map((x) => DynamoDB.Converter.unmarshall(x) as Person);
  }
}

describe.skip('Integrated DynamoDB Test', () => {
  test('Executes an operation to retrieve data', async () => {
    const container = await resetSystemState({
      people: [
        { id: '001', firstName: 'Olivia', lastName: 'Arnold' },
        { id: '002', firstName: 'Joel', lastName: 'Arnold' },
        { id: '003', firstName: 'Israel', lastName: 'Arnold' },
      ],
    });

    const service = container.get<IDynamoService>(DynamoServices.Service);
    const people = await service.execute(ListAllPeople);

    expect(people.length).toBe(3);

    const olivia = people.find((x) => x.id === '001');
    expect(olivia?.firstName).toBe('Olivia');

    const joel = people.find((x) => x.id === '002');
    expect(joel?.firstName).toBe('Joel');

    const izzy = people.find((x) => x.id === '003');
    expect(izzy?.firstName).toBe('Israel');
  });
});
