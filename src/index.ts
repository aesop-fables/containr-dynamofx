import { createServiceModuleWithOptions, IServiceModule } from '@aesop-fables/containr';
import { DynamoFactory } from './DynamoFactory';
import { DynamoServices } from './DynamoServices';
import { IDynamoOperation } from './IDynamoOperation';
import { DynamoService, IDynamoService } from './IDynamoService';
import { DynamoDB } from 'aws-sdk';

export { IDynamoOperation, IDynamoService, DynamoService, DynamoFactory, DynamoServices };

export * from './resolveEnvironmentSettings';

export const useDynamo: (options: DynamoDB.Types.ClientConfiguration) => IServiceModule =
  createServiceModuleWithOptions<DynamoDB.Types.ClientConfiguration>('useDynamo', (services, options) => {
    const client = new DynamoDB(options ?? {});
    services.register<IDynamoService>(DynamoServices.Service, (container) => new DynamoService(container));
    services.register<DynamoDB>(DynamoServices.Client, client);
  });
