const { execSync } = require("child_process");
const { launchPublicDNS } = require("../utils/launchPublicDNS.js");
const { createAirbyteWarehouse } = require("./warehouseSetup/createAirbyteWarehouse.js");
const { createEC2KeyPair } = require("../aws/createEC2KeyPair.js");
const { createAirbyteStack } = require("../aws/createAirbyteStack.js");
const { connectInstance } = require("../aws/connectInstance.js");
const { registerTargets } = require("../aws/registerTargets");
const { storeAirbytePublicDNS } = require("../aws/storePublicDNS.js");
const { setupSnowflakeDestination } = require("./setupConnections/setupSnowflakeDestination.js");
const log = require('../utils/logger.js').logger;


const deployAirbyte = async (projectName, randomString) => {
  await createAirbyteWarehouse();

  log('Provisioning AWS cloud resources...');
  
  const keyPairName = `${projectName}-key-pair-${randomString}`;
  createEC2KeyPair(keyPairName);
  createAirbyteStack(projectName, keyPairName, randomString);

  log('Installing Airbyte on EC2 instance...')
  connectInstance(keyPairName);

  log('Registering target to target group...')
  registerTargets(keyPairName);

  log('Launching Airbyte UI to enter login information...')
  storeAirbytePublicDNS(projectName);
  const publicDNS = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
  await launchPublicDNS(publicDNS);

  await setupSnowflakeDestination(keyPairName, publicDNS, randomString);
}
  module.exports = {
    deployAirbyte
  }