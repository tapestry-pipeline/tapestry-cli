const { execSync } = require("child_process");
const inquirer = require('inquirer');
const { getRegion } = require("../aws/getRegion.js");
const { getAccountId } = require("../aws/getAccountId.js");
const { yamlWriter } = require("../utils/yamlWriter.js");
const chalk = require('chalk');

// const launchConfig = () => {
//   exec('cd grouparoo-config && grouparoo config');
// }

// const terminateConfig = () => {
//   execSync('kill $(lsof -t -i:3000)');
// }

const confirmationQuestion = [
  { type: 'confirm', name: 'confirmation', message: `Please confirm here when you are ready.` }
];

const runRebuild = () => {
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

  console.log(`${chalk.bold.cyan(`Please select an "Existing AWS Profile" from the following menu, and hit enter. Then select the "default" AWS Profile and hit enter":`)}`);

  const contextName = JSON.parse(execSync('aws ssm get-parameter --name "/docker/ecs-context-name"').toString()).Parameter.Value;
  execSync(`docker context create ecs ${contextName}`, { stdio: "inherit" });
  execSync(`docker context use ${contextName}`);

  // writes docker-compose.yml for immediate use
  log('Writing local docker-compose file...');
  yamlWriter(imageUrl);

  log('Writing local .env file...');
  envWriter();

  log('Redeploying Grouparoo image on ECS... (this will take approximately 5-10 min)');
  execSync(`docker compose up &> .ecsLogs`);
  log("Grouparoo image redeployed on ECS!");
  
  const grouparooStackName = JSON.parse(execSync('aws ssm get-parameter --name "/grouparoo/stack-name"').toString()).Parameter.Value;
  execSync(`aws cloudformation wait stack-update-complete --stack-name "${grouparooStackName}"`);
}

const reconfigure = async () => {
  // const configConfirmation = [
  //   {
  //     type: 'confirm',
  //     name: 'confirmConfig',
  //     message: 'Please take a few moments to make your desired configuration changes.\n confirm here when you are ready.'
  //     },
  // ];

  console.log(`${chalk.bold.cyan('Please take a few moments to make your desired configuration changes.')}`);

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
  console.log(`${chalk.bold.cyan(`Be sure you are running this command from your Tapestry project's root folder, called ${projectName}.`)}`);
  // const pathConfirmation = [
  //   {
  //     type: 'confirm',
  //     name: 'confirmPath',
  //     message: `Be sure you are running this command from your Tapestry project's root folder, called ${projectName} for deployment to begin. Confirm when you are ready.`
  //   }
  // ];

  await inquirer
    .prompt(confirmationQuestion)
    .then(async ({ confirmation }) => {
      if (confirmation) {
        // launchConfig();
        console.log(`${chalk.bold.cyan('Rebuild process initiated!')}`);
        await reconfigure();
        // terminateConfig();
      }
    })
    .catch(error => console.log(error));
}

module.exports = async () => {
  console.log('rebuild process initiated...');
  await rebuild();
  console.log('Rebuild complete!');
}
