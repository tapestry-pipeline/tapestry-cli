const { createSource, checkSourceConnection } = require('./createSource.js');
const { createDestination, checkDestinationConnection } = require('./createDestination.js');
const { createOperation } = require('./createOperation.js');
const { createConnectionObject, createConnection } = require('./createConnection.js');
const { getSourceSchema } = require('./getSourceSchema.js')

async function setupAirbyteDestination(domainName, destinationConfigObject) {
  const destinationId = await createDestination(domainName, destinationConfigObject);
  const destinationStatus = await checkDestinationConnection(domainName, destinationId);
  if (destinationStatus !== "succeeded") {
    console.log("error, check snowflake config");
    return;
  }
}

async function setupAirbyteSources(domainName, sourceConfigList, destinationId) {
  const operationId = await createOperation(domainName, "normalization");

  for (const source of sourceConfigList) {
    const schema = await getSourceSchema(domainName, source.sourceDefinitionId, source.connectionConfiguration);
    const sourceId = await createSource(domainName, source);
    const sourceStatus = await checkSourceConnection(domainName, sourceId);
    if (sourceStatus !== 'succeeded') {
      console.log('error, check source config');
      return;
    }

    const connectionObject = await createConnectionObject(sourceId, destinationId, operationId, schema)
    console.log(connectionObject);
    await createConnection(domainName, connectionObject);
  }
}

module.exports = {
  setupAirbyteDestination,
  setupAirbyteSources,
};