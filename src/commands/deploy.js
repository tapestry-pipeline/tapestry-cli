const inquirer = require('inquirer');
const { execSync } = require('child_process');
const { deployAirbyte } = require("../airbyte/deployAirbyte.js");
const { deployGrouparoo } = require('../grouparoo/deployGrouparoo.js')
const { getRandomString } = require("../utils/getRandomString.js");
const log = require('../utils/logger.js').logger;

const grouparooDeployRepoUrl = "https://github.com/tapestry-pipeline/deploy-config-grouparoo.git";
const grouparooDirectory = "deploy-config-grouparoo";

module.exports = async () => {
  const randomString = getRandomString();
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  const pathConfirmation = [{type: 'confirm', name: 'confirmPath', message: `Go to your Tapestry project's root folder, called ${projectName} for deployment to begin. Confirm when you are ready.`}];

  await inquirer
    .prompt(pathConfirmation)
    .then(async ({ confirmPath }) => {
      if (confirmPath) {
        await deployAirbyte(projectName, randomString);
        log("Airbyte deployment is complete!");
        await deployGrouparoo(randomString, grouparooDeployRepoUrl, grouparooDirectory);
        log("Deployment finished!");
      }
    })
    .catch(error => console.log(error));
};
