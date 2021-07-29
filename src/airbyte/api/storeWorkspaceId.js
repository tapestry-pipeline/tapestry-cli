const axios = require("axios");
const { execSync } = require('child_process');

// Old function changed due to Airbyte updating their api (7.29.21):
// async function storeWorkspaceId(domainName) {
//   return await axios
//     .post(`${domainName}/api/v1/workspaces/get_by_slug`, { slug: "default" })
//     .then((response) => {
//       let data = response.data;
//       execSync(`aws ssm put-parameter --name "/airbyte/workspace-id" --value "${data.workspaceId}" --type String --overwrite`);
//     })
//     .catch((error) => console.log(error));
// }

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