const axios = require('axios');

const getAirbyteLogs = async (domainName) => {
  return await axios.post(`${domainName}/api/v1/logs/get`, { logType: "scheduler" })
  .then(({data}) => {
    return data
  })
  .catch(error => {
    console.log(error)
  })
}

module.exports = {
  getAirbyteLogs
}
