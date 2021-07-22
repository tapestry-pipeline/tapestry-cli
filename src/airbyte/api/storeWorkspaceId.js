const axios = require("axios");
// const axiosRetry = require('axios-retry');
const { execSync } = require('child_process');

// axiosRetry(axios, {
//   retries: 3,
//   retryDelay: (retryCount) => {
//     console.log(`retry attempt: ${retryCount}`);
//     return retryCount * 2000; // time interval between retries
//   },
//   retryCondition: (error) => {
//     console.log('Workspace not found. Retrying request...')
//     return error.response.status === 404;
//   }
// });

async function storeWorkspaceId(domainName) {
  return await axios
    .post(`${domainName}/api/v1/workspaces/get_by_slug`, { slug: "default" })
    .then((response) => {
      let data = response.data;
      execSync(`aws ssm put-parameter --name "/airbyte/workspace-id" --value "${data.workspaceId}" --type String --overwrite`);
    })
    .catch((error) => console.log(error));
}

module.exports = {
  storeWorkspaceId
}