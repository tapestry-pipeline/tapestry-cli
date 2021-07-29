const { execSync } = require('child_process');
const inquirer = require('inquirer');
const { getRandomString } = require("../utils/getRandomString.js");
const { kickstartAirbyte } = require("../airbyte/kickstartAirbyte");
const { deployGrouparoo } = require("../grouparoo/deployGrouparoo");

const grouparooKickstartRepoUrl = "https://github.com/tapestry-pipeline/grouparoo-config-kickstart.git";
const grouparooDirectory = "grouparoo-config-kickstart";

module.exports = async () => {
  const randomString = getRandomString();
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  const pathConfirmation = [{type: 'confirm', name: 'confirmPath', message: `Go to your Tapestry project's root folder, called ${projectName} for deployment to begin. Confirm when you are ready.`}];

  await inquirer
    .prompt(pathConfirmation)
    .then(async ({ confirmPath }) => {
      if (confirmPath) {
        await kickstartAirbyte(projectName, randomString);
        deployGrouparoo(randomString, grouparooKickstartRepoUrl, grouparooDirectory);
        console.log("Deployment finished!");
      }
    })
    .catch(error => console.log(error));
}
