import { createServiceModuleWithOptions, IServiceModule } from '@aesop-fables/containr';
import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, TranslateConfig } from '@aws-sdk/lib-dynamodb';
import { DynamoFactory } from './DynamoFactory';
import { DynamoServices } from './DynamoServices';
import { DynamoService, IDynamoService } from './IDynamoService';

export { IDynamoService, DynamoService, DynamoFactory, DynamoServices };

export interface UseDynamoConfiguration {
  core?: DynamoDBClientConfig;
  documentTranslation?: TranslateConfig;
}

export const useDynamo: (options: UseDynamoConfiguration) => IServiceModule =
  createServiceModuleWithOptions<UseDynamoConfiguration>('useDynamo', (services, options) => {
    const client = DynamoFactory.createFullClient(options.core);
    services.register<IDynamoService>(DynamoServices.Service, (container) => new DynamoService(container));
    services.register<DynamoDB>(DynamoServices.Client, client);
    services.register<DynamoDBDocumentClient>(
      DynamoServices.DocClient,
      DynamoDBDocumentClient.from(client, options?.documentTranslation),
    );
  });
