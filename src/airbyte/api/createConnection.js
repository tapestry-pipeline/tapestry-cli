const axios = require("axios");

async function createConnectionObject(sourceId, destinationId, operationId, schema, schedule) {  
  return {
    namespaceDefinition: "source",
    namespaceFormat: "${SOURCE_NAMESPACE}",
    prefix: "TAPESTRY_",
    sourceId: sourceId,
    destinationId: destinationId,
    operationIds: [operationId],
    syncCatalog: {
      streams: schema,
    },
    schedule: schedule,
    status: "active",
    resourceRequirements: {
      cpu_request: "",
      cpu_limit: "",
      memory_request: "",
      memory_limit: "",
    },
  };
}

async function createConnection(domainName, body) {
  return await axios
    .post(`${domainName}/api/v1/connections/create`, body)
    .then((response) => {
      let data = response.data;
      return data.connectionId;
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  createConnectionObject,
  createConnection
}