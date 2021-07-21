const axios = require("axios");

async function createDestination(domainName, body) {
  return await axios
    .post(`${domainName}/api/v1/destinations/create`, body)
    .then((response) => {
      let data = response.data;
      return data.destinationId;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function checkDestinationConnection(domainName, id) {
  return await axios
    .post(`${domainName}/api/v1/destinations/check_connection`, {
      destinationId: id,
    })
    .then((response) => {
      let data = response.data;
      return data.status;
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  createDestination, 
  checkDestinationConnection
}