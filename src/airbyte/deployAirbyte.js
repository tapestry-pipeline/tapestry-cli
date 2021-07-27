const { execSync } = require("child_process");
const { launchPublicDNS } = require("../utils/launchPublicDNS.js");
const { createAirbyteWarehouse } = require("./warehouseSetup/createAirbyteWarehouse.js");
const { createEC2KeyPair } = require("../aws/createEC2KeyPair.js");
const { createAirbyteStack } = require("../aws/createAirbyteStack.js");
const { connectInstance } = require("../aws/connectInstance.js");
const { registerTargets } = require("../aws/registerTargets");
const { storePublicDNS } = require("../aws/storePublicDNS.js");
const { setupSnowflakeDestination } = require("./setupConnections/setupSnowflakeDestination.js");


const deployAirbyte = async (projectName, randomString) => {
  await createAirbyteWarehouse();

  console.log('Provisioning AWS cloud resources...');
  
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

  await setupSnowflakeDestination(keyPairName, publicDNS, randomString);

  console.log("Airbyte deployment is complete.");
}
  module.exports = {
    deployAirbyte
  }