const axios = require("axios");

async function createOperation(domainName) {
  let body = {
    name: "Normalization for Snowfake",
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
      let data = response.data;
      return data.operationId;
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  createOperation
}