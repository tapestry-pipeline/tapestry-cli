const { connectToECR } = require("../aws/connectToECR.js");
const { execSync } = require('child_process');

const deployGrouparoo = (randomString, grouparooDeployRepoUrl, grouparooDirectory) => {
  console.log("Now Grouparoo setup will begin...");
  execSync(`git clone ${grouparooDeployRepoUrl}`);
  console.log("now getting ready for connecting to ECR...");

  connectToECR(grouparooDirectory, randomString);
}


module.exports = {
  deployGrouparoo
}