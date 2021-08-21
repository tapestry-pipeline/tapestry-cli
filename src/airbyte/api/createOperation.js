const axios = require("axios");

async function createOperation(domainName, workspaceId) {
  const body = {
    workspaceId, 
    name: "Normalization for Snowflake",
    operatorConfiguration: {
      operatorType: "normalization",
      normalization: {
        option: "basic",
      },
    },
  };
  
  return await axios
    .post(`${domainName}/api/v1/operations/create`, body)
    .then((response) => {
      const data = response.data;
      return data.operationId;
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  createOperation
}