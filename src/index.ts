import { createServiceModuleWithOptions, IServiceModule } from '@aesop-fables/containr';
import { DynamoDB } from 'aws-sdk';
import { DynamoFactory } from './DynamoFactory';
import { DynamoServices } from './DynamoServices';
import { IDynamoOperation } from './IDynamoOperation';
import { DynamoService, IDynamoService } from './IDynamoService';

export { IDynamoOperation, IDynamoService, DynamoService, DynamoFactory, DynamoServices };

export interface UseDynamoConfiguration {
  core?: DynamoDB.Types.ClientConfiguration;
}

export const useDynamo: (options: UseDynamoConfiguration) => IServiceModule =
  createServiceModuleWithOptions<UseDynamoConfiguration>('useDynamo', (services, options) => {
    const client = DynamoFactory.createFullClient(options.core);
    services.register<IDynamoService>(DynamoServices.Service, (container) => new DynamoService(container));
    services.register<DynamoDB>(DynamoServices.Client, client);
  });
