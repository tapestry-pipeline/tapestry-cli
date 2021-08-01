const inquirer = require('inquirer');
const { execSync, exec } = require('child_process');
const process = require('process');
const airbyteRepo = "https://github.com/tapestry-pipeline/airbyte.git";
const log = require('../utils/logger.js').logger;
const chalk = require('chalk');
const tapestryAscii = require('../utils/tapestryAscii.js');

const questions = [
  { type: 'input', name: 'projectName', message: 'Project name:', default: 'tapestry-project' },
];

const gatherInfo = async () => {
  console.log(`${chalk.bold.cyan('Please provide the following details:')}`);
  await inquirer
    .prompt(questions)
    .then(async answers => {
      execSync(`aws ssm put-parameter --name "/project-name" --value "${answers.projectName}" --type String --overwrite`);
    })
    .catch(error => console.log(error));
}

const provisionFolders = async () => {
  log('Provisioning folders...');
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  execSync(`mkdir ${projectName}`);
  process.chdir(`${projectName}`);
  exec(`git clone ${airbyteRepo}`); // TODO - execSync solution for this?\
  log("New folders provisioned!");
  console.log(`${chalk.bold.cyan(`Now please change to your Tapestry project's root folder, called ${projectName}!`)}`);
}

module.exports = async () => {
  tapestryAscii();
  await gatherInfo();
  await provisionFolders();
}