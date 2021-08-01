const inquirer = require('inquirer');
const { execSync, exec } = require('child_process');
const chalk = require('chalk');
const process = require('process');
const airbyteRepo = "https://github.com/tapestry-pipeline/airbyte.git";
const tapestryAscii = require('../utils/tapestryAscii.js');


const questions = [
  { type: 'input', name: 'projectName', message: 'Project name:', default: 'tapestry-project' },
];
tapestryAscii();
const gatherInfo = async () => {
  console.log('Please provide the following details:')
  await inquirer
    .prompt(questions)
    .then(async answers => {
      execSync(`aws ssm put-parameter --name "/project-name" --value "${answers.projectName}" --type String --overwrite`);
    })
    .catch(error => console.log(error));
}

const provisionFolders = async () => {
  console.log(`\uD83D\uDD53 ${chalk.bold.yellow('Provisioning folders...')}`);
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  execSync(`mkdir ${projectName}`);
  process.chdir(`${projectName}`);
  exec(`git clone ${airbyteRepo}`); // TODO - execSync solution for this?
  console.log(`\u2705 ${chalk.bold.green('Folders provisioned!')}`);
}

module.exports = async () => {
  await gatherInfo();
  await provisionFolders();
}