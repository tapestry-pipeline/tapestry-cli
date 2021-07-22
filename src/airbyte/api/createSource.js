const axios = require("axios");

async function createSource(domainName, body) {
  return await axios
    .post(`${domainName}/api/v1/sources/create`, body)
    .then((response) => {
      let data = response.data;
      return data.sourceId;
    })
    .catch((error) => console.log(error));
}

async function checkSourceConnection(domainName, id) {
  return await axios
    .post(`${domainName}/api/v1/sources/check_connection`, { sourceId: id })
    .then((response) => {
      let data = response.data;
      return data.status;
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  createSource, 
  checkSourceConnection,
}