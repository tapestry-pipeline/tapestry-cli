const inquirer = require('inquirer');
const chalk = require('chalk');
const { execSync } = require('child_process');
const { deployAirbyte } = require("../airbyte/deployAirbyte.js");
const { deployGrouparoo } = require('../grouparoo/deployGrouparoo.js')
const { getRandomString } = require("../utils/getRandomString.js");
const startServer = require('./start-server');
const log = require('../utils/logger.js').logger;

const grouparooDeployRepoUrl = "https://github.com/tapestry-pipeline/deploy-config-grouparoo.git";
const grouparooDirectory = "deploy-config-grouparoo";

module.exports = async () => {
  const randomString = getRandomString();
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  console.log(`${chalk.bold.cyan(`Go to your Tapestry project's root folder, called "${projectName}" for deployment to begin.`)}`);

  const confirmationQuestion = [
    { type: 'confirm', name: 'confirmation', message: `Please confirm here when you are ready.` }
  ];

  await inquirer
    .prompt(confirmationQuestion)
    .then(async ({ confirmation }) => {
      if (confirmation) {
        await deployAirbyte(projectName, randomString);
        log("Airbyte deployment is complete!");
        await deployGrouparoo(randomString, grouparooDeployRepoUrl, grouparooDirectory);
        log("Deployment finished!");
        log("Launching Tapestry UI...");
        startServer();
      }
    })
    .catch(error => console.log(error));
};
