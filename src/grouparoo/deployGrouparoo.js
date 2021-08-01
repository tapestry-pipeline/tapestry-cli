const { connectToECR } = require("../aws/connectToECR.js");
const { execSync, exec } = require('child_process');
const chalk = require('chalk');
const { storeGrouparooPublicDNS } = require("../aws/storePublicDNS.js");

const deployGrouparoo = (randomString, grouparooDeployRepoUrl, grouparooDirectory) => {
  console.log(`${chalk.bold.cyan("Now Grouparoo setup will begin...")}`);
  exec(`git clone -b apikey ${grouparooDeployRepoUrl}`); // TODO - possibly change to execSync

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
}

module.exports = {
  deployGrouparoo
}