import 'reflect-metadata';
import { inject, ServiceCollection } from '@aesop-fables/containr';
import { IDynamoOperation } from '../IDynamoOperation';
import { DynamoService } from '../IDynamoService';

interface IRecorder {
  record(message: string): void;
}

class SampleOperation implements IDynamoOperation<void, string> {
  constructor(@inject('recorder') private readonly recorder: IRecorder) {}
  async execute(params: string): Promise<void> {
    this.recorder.record(params);
  }
}

describe('DynamoService', () => {
  test('resolves the operation via the container', async () => {
    const messages: string[] = [];
    const services = new ServiceCollection();
    services.register<IRecorder>('recorder', {
      record(message) {
        messages.push(message);
      },
    });

    const container = services.buildContainer();
    const service = new DynamoService(container);

    await service.execute(SampleOperation, 'Hello, World!');

    expect(messages.length).toBe(1);
    expect(messages[0]).toBe('Hello, World!');
  });
});
