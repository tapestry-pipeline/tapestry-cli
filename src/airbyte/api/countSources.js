const axios = require('axios');

async function countSources(domainName, workspaceId)  {
  return await axios
    .post(`${domainName}/api/v1/sources/list`, { workspaceId})
    .then((response) => {
      let data = response.data;
      return data.sources.length
      
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  countSources
}
