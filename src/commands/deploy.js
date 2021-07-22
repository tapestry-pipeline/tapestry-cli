const { execSync } = require('child_process');
const { randomizeKeyPairName } = require('../utils/randomizeKeyPairName.js');
const { launchPublicDNS } = require('../utils/launchPublicDNS.js'); 
const { createAirbyteWarehouse } = require('../airbyte/warehouseSetup/createAirbyteWarehouse.js');
const { createEC2KeyPair } = require('../aws/createEC2KeyPair.js');
const { createAirbyteStack } = require('../aws/createAirbyteStack.js');
const { connectInstance } = require('../aws/connectInstance.js');
const { registerTargets } = require('../aws/registerTargets'); 
const { storePublicDNS } = require('../aws/storePublicDNS.js');
const { setupSnowflakeDestination } = require('../airbyte/setupConnections/setupSnowflakeDestination.js'); 

module.exports = async () => {
  await createAirbyteWarehouse();
  
  console.log('Provisioning AWS cloud resources...');
  const keyPairName = randomizeKeyPairName();
  createEC2KeyPair(keyPairName); 
  createAirbyteStack(keyPairName);

  console.log('Installing Airbyte on EC2 instance...')
  connectInstance(keyPairName);

  console.log('Registering target to target group...')
  registerTargets(keyPairName);
  
  console.log('Launching Airbyte UI to enter login information...')
  storePublicDNS(keyPairName);
  const publicDNS = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
  launchPublicDNS(publicDNS);

  await setupSnowflakeDestination(keyPairName, publicDNS);
  
  console.log('Deployment finished!');
}