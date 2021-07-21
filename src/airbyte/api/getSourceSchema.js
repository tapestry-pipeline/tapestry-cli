const axios = require("axios");
const SALESFORCE_DEFINITION_ID = "2470e835-feaf-4db6-96f3-70fd645acc77"; 

const filterSchemas = (streamArray, streamName) => {
  return streamArray.filter((streamObject) => {
    return streamObject.stream.name === streamName;
  });
};

async function getSourceSchema(domainName, sourceDefinitionId, connectionConfiguration) {
  let obj = {
    sourceDefinitionId: sourceDefinitionId,
    connectionConfiguration: connectionConfiguration
  };

  let schemaName; 
  if (sourceDefinitionId === SALESFORCE_DEFINITION_ID) {
    schemaName = "Contact";
  } else {
    schemaName = "users";
  }

  return await axios
    .post(`${domainName}/api/v1/scheduler/sources/discover_schema`, obj)
    .then((response) => {
      let data = response.data;
      console.log(data);
      return filterSchemas(data.catalog.streams, schemaName);
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  getSourceSchema
}

