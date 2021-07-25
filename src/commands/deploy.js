const { execSync, exec } = require("child_process");
const { getRandomString } = require("../utils/getRandomString.js");
const { launchPublicDNS } = require("../utils/launchPublicDNS.js");
const {
  createAirbyteWarehouse,
} = require("../airbyte/warehouseSetup/createAirbyteWarehouse.js");
const { createEC2KeyPair } = require("../aws/createEC2KeyPair.js");
const { createAirbyteStack } = require("../aws/createAirbyteStack.js");
const { connectInstance } = require("../aws/connectInstance.js");
const { registerTargets } = require("../aws/registerTargets");
const { storePublicDNS } = require("../aws/storePublicDNS.js");
const {
  setupSnowflakeDestination,
} = require("../airbyte/setupConnections/setupSnowflakeDestination.js");
const githubDeployUrl =
  "https://github.com/tapestry-pipeline/deploy-config-grouparoo.git";
const { connectToECR } = require("../aws/connectToECR.js");
const grouparooDirectory = "deploy-config-grouparoo";

module.exports = async () => {
  // await createAirbyteWarehouse();

  // console.log('Provisioning AWS cloud resources...');
  const randomString = getRandomString();
  const keyPairName = "tapestry-key-pair" + randomString;
  // createEC2KeyPair(keyPairName);
  // createAirbyteStack(keyPairName);

  // console.log('Installing Airbyte on EC2 instance...')
  // connectInstance(keyPairName);

  // console.log('Registering target to target group...')
  // registerTargets(keyPairName);

  // console.log('Launching Airbyte UI to enter login information...')
  // storePublicDNS(keyPairName);
  // const publicDNS = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
  // launchPublicDNS(publicDNS);

  // await setupSnowflakeDestination('tapestry-key-pair-j4093', publicDNS);

  const projectName = JSON.parse(
    execSync('aws ssm get-parameter --name "/project-name"').toString()
  ).Parameter.Value;
  // need to make sure user is in the cloned project folder; make this a confirmation
  console.log(
    `Now your Airbyte is all set up. Go to your Tapestry project folder, called ${projectName} for Grouparoo deployment to begin.`
  ); // TODO- change to confirmation
  // execSync(`git clone -b secrets ${githubDeployUrl}`);
  // execSync(`cd ${grouparooDirectory} && npm install`, {
  //   stdio: "inherit",
  // });
  console.log("now getting ready for connecting to ECR...");
  // npm install -g grouparoo && grouparoo apply // TODO- Use FS to make the switch to right folder
  connectToECR(grouparooDirectory, randomString);

  console.log("Deployment finished!");
};
