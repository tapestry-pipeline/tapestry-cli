const axios = require("axios");
const { execSync } = require('child_process');

async function storeWorkspaceId(domainName) {
  return await axios
  .post(`${domainName}/api/v1/workspaces/list`)
  .then((response) => {
    let data = response.data;
    let workspaceObject = data.workspaces[0];
    execSync(`aws ssm put-parameter --name "/airbyte/workspace-id" --value "${workspaceObject.workspaceId}" --type String --overwrite`);
  })
  .catch((error) => console.log(error));

}

module.exports = {
  storeWorkspaceId
}