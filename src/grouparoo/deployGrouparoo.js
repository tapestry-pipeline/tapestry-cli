const { connectToECR } = require("../aws/connectToECR.js");
const { execSync } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { storeGrouparooPublicDNS } = require("../aws/storePublicDNS.js");
const { launchPublicDNS } = require("../utils/launchPublicDNS.js");

const validateInput = async (input) => {
  if (input === '') {
    return 'Field required! Must provide input!'
  };
  return true;
}

const deployGrouparoo = async (randomString, grouparooDeployRepoUrl, grouparooDirectory) => {
  console.log(`${chalk.bold.cyan("Now Grouparoo setup will begin...")}`);
  execSync(`git clone ${grouparooDeployRepoUrl}`);

  let mode;
  if (grouparooDirectory === 'deploy-config-grouparoo') {
    mode = 'deploy';
  } else {
    mode = 'kickstart';
  }

  execSync(`aws ssm put-parameter --name "/tapestry/mode" --value "${mode}" --type String --overwrite`);

  execSync(`mv ${grouparooDirectory} grouparoo-config`);

  connectToECR(randomString);

  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  storeGrouparooPublicDNS(projectName);

  execSync(`aws ecs update-cluster-settings --cluster ${projectName} --settings name=containerInsights,value=enabled`);

  const groupPublicDNS = JSON.parse(execSync(`aws ssm get-parameter --name "/grouparoo/public-dns"`).toString()).Parameter.Value;
  await launchPublicDNS(groupPublicDNS);

  console.log(`${chalk.bold.cyan('Please refer to the browser and sign in to your Grouparoo application by creating a team. Then locate your "tapestry" API key (found under "Platforms").')}`);

  const getGroupApiKey = [
    { type: 'input', name: 'apiKey', message: 'Please enter your API key here:', validate: validateInput },
  ];

  await inquirer
    .prompt(getGroupApiKey)
    .then(({ apiKey }) => {
      execSync(`aws ssm put-parameter --name "/grouparoo/api-key" --value "${apiKey}" --type String --overwrite`);
    });
}

module.exports = {
  deployGrouparoo
}