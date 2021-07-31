const axios = require('axios');


const getLogs = async (domainName) => {
  return await axios.post(`${domainName}/api/v1/logs/get`)
  .then(({data}) => {
    console.log(data)
    return data
  })
  .catch(error => {
    console.log('error')
    console.log(error)
  })
}

module.exports = {
  getLogs
}
