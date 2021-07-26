const { execSync } = require("child_process");
const { getRandomString } = require("../utils/getRandomString.js");
const { launchPublicDNS } = require("../utils/launchPublicDNS.js");
const { createAirbyteWarehouse } = require("../airbyte/warehouseSetup/createAirbyteWarehouse.js");
const { createEC2KeyPair } = require("../aws/createEC2KeyPair.js");
const { createAirbyteStack } = require("../aws/createAirbyteStack.js");
const { connectInstance } = require("../aws/connectInstance.js");
const { registerTargets } = require("../aws/registerTargets");
const { storePublicDNS } = require("../aws/storePublicDNS.js");
const { setupSnowflakeDestination } = require("../airbyte/setupConnections/setupSnowflakeDestination.js");
const grouparooDeployUrl = "https://github.com/tapestry-pipeline/deploy-config-grouparoo.git";
const { connectToECR } = require("../aws/connectToECR.js");
const grouparooDirectory = "deploy-config-grouparoo";
const inquirer = require('inquirer');

module.exports = async () => {
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  const pathConfirmation = [{type: 'confirm', name: 'confirmPath', message: `Go to your Tapestry project folder, called ${projectName} for deployment to begin. Confirm when you are ready.`}];

  await inquirer
    .prompt(pathConfirmation)
    .then(async ({ confirmPath }) => {
      if (confirmPath) {
        await createAirbyteWarehouse();

        console.log('Provisioning AWS cloud resources...');
        const randomString = getRandomString();
        const keyPairName = "tapestry-key-pair" + randomString;
        createEC2KeyPair(keyPairName);
        createAirbyteStack(projectName, keyPairName, randomString);

        console.log('Installing Airbyte on EC2 instance...')
        connectInstance(keyPairName);

        console.log('Registering target to target group...')
        registerTargets(keyPairName);

        console.log('Launching Airbyte UI to enter login information...')
        storePublicDNS(projectName);
        const publicDNS = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
        launchPublicDNS(publicDNS);

        await setupSnowflakeDestination(keyPairName, publicDNS);

        console.log("Airbyte deployment is complete. Now Grouparoo setup will begin...");
        execSync(`git clone ${grouparooDeployUrl}`);

        console.log("now getting ready for connecting to ECR...");
       
        connectToECR(grouparooDirectory, randomString);
        console.log("Deployment finished!");
      }
    })
};
