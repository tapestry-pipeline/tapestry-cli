const { execSync, exec } = require('child_process');
const { randomizeKeyPairName } = require('../utils/randomizeKeyPairName.js');
const { launchPublicDNS } = require('../utils/launchPublicDNS.js'); 
const { createAirbyteWarehouse } = require('../airbyte/warehouseSetup/createAirbyteWarehouse.js');
const { createEC2KeyPair } = require('../aws/createEC2KeyPair.js');
const { createAirbyteStack } = require('../aws/createAirbyteStack.js');
const { connectInstance } = require('../aws/connectInstance.js');
const { registerTargets } = require('../aws/registerTargets'); 
const { storePublicDNS } = require('../aws/storePublicDNS.js');
const { setupSnowflakeDestination } = require('../airbyte/setupConnections/setupSnowflakeDestination.js'); 
const githubDeployUrl = "https://github.com/tapestry-pipeline/grouparoo-config-deploy.git";
const { connectToECR } = require('../aws/connectToECR.js');
const grouparooDirectory = 'grouparoo-config-deploy';


module.exports = async () => {
  // await createAirbyteWarehouse();
  
  // console.log('Provisioning AWS cloud resources...');
  // const keyPairName = randomizeKeyPairName();
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
  
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  // need to make sure user is in the cloned project folder; make this a confirmation
  console.log(`Now your Airbyte is all set up. Go to your Tapestry project folder, called ${projectName} for Grouparoo deployment to begin.`); // TODO- change to confirmation
  execSync(`git clone ${githubDeployUrl}`);
  connectToECR(grouparoDirectory);
  

  
  
  console.log('Deployment finished!');
}