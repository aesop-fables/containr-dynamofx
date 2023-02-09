// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IDynamoOperation<Result = void, Params = any> {
  execute(params: Params): Promise<Result>;
}
