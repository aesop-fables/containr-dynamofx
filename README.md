@aesop-fables/containr-dynamofx

Provides a common bootstrapping configuration for using DynamoDB in your Typescript applications (i.e., `Triginta` microservices).

## Sample Usage

```typescript
const container = createContainer([
  useDynamo({
    // optionally pass in anything you would to DynamoDB from @aws-sdk/client-dynamodb
  })
  myCustomModule,
])
```