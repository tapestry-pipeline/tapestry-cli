const axios = require('axios');

const getGrouparooDestinations = async (DNS, apiKey) => {
  return await axios.get(`${DNS}/api/v1/destinations?&apiKey=${apiKey}`)
  .then(({data}) => {
    return data.total;
  })
  .catch(error => {
    console.log(error);
  })
}

module.exports = {
  getGrouparooDestinations
}