const axios = require('axios');

const getGrouparooLogs = async (DNS, apiKey) => {
  return await axios.get(`${DNS}/api/v1/logs?limit=10&offset=0&apiKey=${apiKey}`)
  .then(({data}) => {
    return data;
  })
  .catch(error => {
    console.log(error);
  })
}

module.exports = {
  getGrouparooLogs
}