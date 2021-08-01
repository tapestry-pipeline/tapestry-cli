const axios = require('axios');

const getAirbyteLogs = async (DNS) => {
  return await axios.post(`${DNS}/api/v1/logs/get`, { logType: "scheduler" })
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
