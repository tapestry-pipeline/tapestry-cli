const { execSync } = require('child_process');
const { createSource, checkSourceConnection } = require('../api/createSource.js');
const { createDestination, checkDestinationConnection } = require('../api/createDestination.js');
const { createOperation } = require('../api/createOperation.js');
const { createConnectionObject, createConnection } = require('../api/createConnection.js');
const { getSourceSchema } = require('../api/getSourceSchema.js')

async function setupAirbyteDestination(domainName, destinationConfigObject) {
  const destinationId = await createDestination(domainName, destinationConfigObject);
  execSync(`aws ssm put-parameter --name "/airbyte/snowflake-destination-id" --value "${destinationId}" --type String --overwrite`)
  const destinationStatus = await checkDestinationConnection(domainName, destinationId);
  if (destinationStatus !== "succeeded") {
    console.log("error, check snowflake config");
    return;
  }
}

async function setupAirbyteSources(domainName, sourceConfigList, destinationId, syncObj, workspaceId) {
  const operationId = await createOperation(domainName, workspaceId);

  for (const source of sourceConfigList) {
    const schema = await getSourceSchema(domainName, source.sourceDefinitionId, source.connectionConfiguration);
    const sourceId = await createSource(domainName, source);
    const sourceStatus = await checkSourceConnection(domainName, sourceId);
    if (sourceStatus !== 'succeeded') {
      console.log('error, check source config');
      return;
    }

    const connectionObject = await createConnectionObject(sourceId, destinationId, operationId, schema, syncObj);
    console.log("Creating connection...")
    await createConnection(domainName, connectionObject);
  }
}

module.exports = {
  setupAirbyteDestination,
  setupAirbyteSources,
};
