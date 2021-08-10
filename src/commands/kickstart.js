const { execSync } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { getRandomString } = require("../utils/getRandomString.js");
const { kickstartAirbyte } = require("../airbyte/kickstartAirbyte");
const { deployGrouparoo } = require("../grouparoo/deployGrouparoo");
const startServer = require('./start-server');
const log = require('../utils/logger.js').logger;

const grouparooKickstartRepoUrl = "https://github.com/tapestry-pipeline/grouparoo-config-kickstart.git";
const grouparooDirectory = "grouparoo-config-kickstart";

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
        await kickstartAirbyte(projectName, randomString);
        log("Airbyte deployment is complete!");

        console.log(`${chalk.bold.cyan('Please visit the following URL and complete the steps for "Configuring DBT": https://github.com/tapestry-pipeline/dbt.git')}`);

        const dbtPrompt = inquirer.createPromptModule();
        await dbtPrompt(confirmationQuestion)
          .then(async ({ confirmation }) => {
            if (confirmation) {
              await deployGrouparoo(randomString, grouparooKickstartRepoUrl, grouparooDirectory);
              log("Deployment finished!");
              log("Launching Tapestry UI...");
              startServer();
            }
        });
      }
    })
    .catch(error => console.log(error));
}
