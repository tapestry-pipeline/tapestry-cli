const inquirer = require('inquirer');
const { deployAirbyte } = require("../airbyte/deployAirbyte.js");
const { deployGrouparoo } = require('../grouparoo/deployGrouparoo.js')
const { getRandomString } = require("../utils/getRandomString.js");

const grouparooDeployRepoUrl = "https://github.com/tapestry-pipeline/deploy-config-grouparoo.git";
const grouparooDirectory = "deploy-config-grouparoo";

module.exports = async () => {
  const randomString = getRandomString();
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  const pathConfirmation = [{type: 'confirm', name: 'confirmPath', message: `Go to your Tapestry project folder, called ${projectName} for deployment to begin. Confirm when you are ready.`}];

  await inquirer
    .prompt(pathConfirmation)
    .then(async ({ confirmPath }) => {
      if (confirmPath) {
        deployAirbyte(projectName, randomString);
        deployGrouparoo(randomString, grouparooDeployRepoUrl, grouparooDirectory);
        console.log("Deployment finished!");
      }
    })
};
