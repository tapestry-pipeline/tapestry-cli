const { connectToECR } = require("../aws/connectToECR.js");
const { execSync, exec } = require('child_process');
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
  execSync(`git clone ${grouparooDeployRepoUrl}`); // TODO - possibly change to execSync

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

  const getGroupApiKey = [
    {
      type: 'input',
      name: 'apiKey',
      message: 'Please sign in to your Grouparoo application by creating a team.\n' +
               'Then locate your "tapestry" API key (found under "Platforms") and enter it here:',
      validate: validateInput,
    }
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