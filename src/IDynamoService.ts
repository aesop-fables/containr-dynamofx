import { IServiceContainer, Newable } from '@aesop-fables/containr';
import { IDynamoOperation } from './IDynamoOperation';

export interface IDynamoService {
  execute<Result, Params>(constructor: Newable<IDynamoOperation<Result, Params>>, params?: Params): Promise<Result>;
}

export class DynamoService implements IDynamoService {
  constructor(private readonly container: IServiceContainer) {}

  execute<Result, Params>(
    constructor: Newable<IDynamoOperation<Result, Params>>,
    params?: Params | undefined,
  ): Promise<Result> {
    const operation = this.container.resolve<IDynamoOperation<Result, Params>>(constructor);
    return operation.execute(params as Params);
  }
}
