const { execSync } = require("child_process");
const inquirer = require('inquirer');
const { getRegion } = require("../aws/getRegion.js");
const { getAccountId } = require("../aws/getAccountId.js");
const { yamlWriter } = require("../utils/yamlWriter.js");
const { envWriter } = require("../utils/envWriter.js");
const chalk = require('chalk');
const log = require('../utils/logger.js').logger;

const confirmationQuestion = [
  { type: 'confirm', name: 'confirmation', message: `Please confirm here when you are ready.` }
];

const runRebuild = () => {
  log('Rebuild process initiated!');

  const region = getRegion();
  const accountId = getAccountId();

  log('Connecting to ECR...');

  // login
  execSync(`aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin "${accountId}.dkr.ecr.${region}.amazonaws.com"`);

  // switch context to run build command
  execSync(`docker context use default`);

  // build
  log("Rebuilding local Grouparoo image... (this will take approximately 3 min)");
  execSync(`docker build -t grouparoo ./grouparoo-config &> .buildLogs`);
  log("Local image rebuild complete!");

  // tag
  execSync(`docker tag grouparoo:latest ${accountId}.dkr.ecr.${region}.amazonaws.com/grouparoo:latest`);

  // push
  log("Pushing Grouparoo image to ECR... (this will take approximately 4 min)");
  const imageUrl = `${accountId}.dkr.ecr.${region}.amazonaws.com/grouparoo:latest`;
  execSync(`docker push ${imageUrl}`);
  log("Grouparoo image pushed!");

  const contextName = JSON.parse(execSync('aws ssm get-parameter --name "/docker/ecs-context-name"').toString()).Parameter.Value;
  execSync(`docker context use ${contextName}`);

  // writes docker-compose.yml for immediate use
  log('Writing local docker-compose file...');
  yamlWriter(imageUrl);

  log('Writing local .env file...');
  envWriter();

  log('Redeploying Grouparoo image on ECS... (this will take approximately 5-10 min)');
  execSync(`docker compose up &> .ecsLogs`);
  
  const grouparooStackName = JSON.parse(execSync('aws ssm get-parameter --name "/grouparoo/stack-name"').toString()).Parameter.Value;
  execSync(`aws cloudformation wait stack-update-complete --stack-name "${grouparooStackName}"`);

  log("Grouparoo image redeployed on ECS!");
}

const reconfigure = async () => {
  console.log(`${chalk.bold.cyan('Please take a few moments to make your desired configuration changes.\n' +
                                 '(You can find more info about how to do this here: https://www.grouparoo.com/docs/config)')}`);

  await inquirer
    .prompt(confirmationQuestion)
    .then(({ confirmation }) => {
      if (confirmation) {
        runRebuild();
      }
    })
    .catch(error => console.log(error));
}

const rebuild = async () => {
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  console.log(`${chalk.bold.cyan(`Be sure you are running this command from your Tapestry project's root folder called "${projectName}".`)}`);

  await inquirer
    .prompt(confirmationQuestion)
    .then(async ({ confirmation }) => {
      if (confirmation) {
        await reconfigure();
        log('Rebuild complete!');
      }
    })
    .catch(error => console.log(error));
}

module.exports = async () => {
  await rebuild();
}
