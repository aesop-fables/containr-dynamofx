import { createServiceModuleWithOptions, IServiceModule } from '@aesop-fables/containr';
import { DynamoFactory } from './DynamoFactory';
import { DynamoServices } from './DynamoServices';
import { IDynamoOperation } from './IDynamoOperation';
import { DynamoService, IDynamoService } from './IDynamoService';
import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

export { IDynamoOperation, IDynamoService, DynamoService, DynamoFactory, DynamoServices };

export * from './resolveEnvironmentSettings';

export const useDynamo: (options: DynamoDBClientConfig) => IServiceModule =
  createServiceModuleWithOptions<DynamoDBClientConfig>('useDynamo', (services, options) => {
    const client = new DynamoDB(options ?? {});
    services.register<IDynamoService>(DynamoServices.Service, (container) => new DynamoService(container));
    services.register<DynamoDB>(DynamoServices.Client, client);
  });
