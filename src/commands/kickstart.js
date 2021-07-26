const { execSync } = require('child_process');
const { getRandomString } = require("../utils/getRandomString.js");
const { kickstartAirbyte } = require("../airbyte/kickstartAirbyte");
const { deployGrouparoo } = require("../grouparoo/deployGrouparoo");

const grouparooKickstartRepoUrl = "https://github.com/tapestry-pipeline/grouparoo-config-kickstart.git";
const grouparooDirectory = "grouparoo-config-kickstart";

module.exports = async () => {
  const randomString = getRandomString();
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  kickstartAirbyte(projectName, randomString);
  deployGrouparoo(randomString, grouparooKickstartRepoUrl, grouparooDirectory);
}
