const axios = require("axios");
const SALESFORCE_DEFINITION_ID = "2470e835-feaf-4db6-96f3-70fd645acc77"; 
const { contactSchema } = require('../configObjects/ContactSchema.js');
const log = require('../../utils/logger.js').logger;

const filterSchemas = (streamArray, streamName) => {
  return streamArray.filter((streamObject) => {
    return streamObject.stream.name === streamName;
  });
};

async function getSourceSchema(domainName, sourceDefinitionId, connectionConfiguration) {
  if (sourceDefinitionId === SALESFORCE_DEFINITION_ID) {
    log("Getting Salesforce schema...")
    return [ contactSchema ]; 
  } else {
    log("Getting Zoom schema...")

    const schemaName = "webinar_registrants";
    const reqObj = {
      sourceDefinitionId: sourceDefinitionId,
      connectionConfiguration: connectionConfiguration
    };

    return await axios
      .post(`${domainName}/api/v1/scheduler/sources/discover_schema`, reqObj)
      .then((response) => {
        const data = response.data;
        return filterSchemas(data.catalog.streams, schemaName);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = {
  getSourceSchema
}

