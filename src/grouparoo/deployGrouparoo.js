const { connectToECR } = require("../aws/connectToECR.js");
const { execSync } = require('child_process');

const deployGrouparoo = (randomString, grouparooDeployRepoUrl, grouparooDirectory) => {
  console.log("Now Grouparoo setup will begin...");
  execSync(`git clone ${grouparooDeployRepoUrl}`);

  let mode;
  if (grouparooDirectory === 'deploy-config-grouparoo') {
    mode = 'deploy';
  } else {
    mode = 'kickstart';
  }

  execSync(`aws ssm put-parameter --name "/tapestry/mode" --value "${mode}" --type String --overwrite`);

  execSync(`mv ${grouparooDirectory} 'grouparoo-config`);

  console.log("now getting ready for connecting to ECR...");

  connectToECR(randomString);
}

module.exports = {
  deployGrouparoo
}