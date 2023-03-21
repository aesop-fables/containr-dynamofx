import { createServiceModuleWithOptions, IServiceModule } from '@aesop-fables/containr';
import { DynamoDB } from 'aws-sdk';
import { DynamoFactory } from './DynamoFactory';
import { DynamoServices } from './DynamoServices';
import { DynamoService, IDynamoService } from './IDynamoService';

export const useDynamo: (options: DynamoDB.Types.ClientConfiguration) => IServiceModule =
  createServiceModuleWithOptions<DynamoDB.Types.ClientConfiguration>('useDynamo', (services, options) => {
    const client = DynamoFactory.createFullClient(options);
    services.register<IDynamoService>(DynamoServices.Service, (container) => new DynamoService(container));
    services.register<DynamoDB>(DynamoServices.Client, client);
  });
