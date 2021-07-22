const { execSync } = require('child_process');
const inquirer = require('inquirer');
const { storeWorkspaceId } = require('../api/storeWorkspaceId.js');
const { setupAirbyteDestination } = require('./airbyteSetup.js');
const { buildSnowflakeDestination } = require('../configObjects/buildSnowflakeDestination.js');
const { getInstanceId } = require('../../aws/getInstanceId.js'); 
const { getS3BucketCredentials } = require('../../aws/getS3BucketCredentials.js');

const setupSnowflakeDestination = async (keyPairName, publicDNS) => {
  const loginConfirmation = [{type: 'confirm', name: 'confirmAbLogin', message: 'Please enter your email in the browser and click "continue" to create your workspace. \n Be sure to "skip onboarding step"! Confirm when you are ready.'}];

  await inquirer
    .prompt(loginConfirmation)
    .then(async ({ confirmAbLogin }) => {
      if (confirmAbLogin) {
        console.log("Thanks for creating your workspace!");
        
        console.log("Setting up Snowflake as a destination in Airbyte...");
        await storeWorkspaceId(publicDNS);
        
        const workspaceId = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/workspace-id"').toString()).Parameter.Value;
        const instanceId = getInstanceId(keyPairName);
        const s3BucketCredentials = getS3BucketCredentials(keyPairName, instanceId);
        const snowAbPass = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/ab-pass" --with-decryption').toString()).Parameter.Value;
        const snowAcctHost = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-hostname" --with-decryption').toString()).Parameter.Value;

        const destinationObj = buildSnowflakeDestination(snowAbPass, snowAcctHost, s3BucketCredentials, workspaceId);
        await setupAirbyteDestination(publicDNS, destinationObj);
      }
    })
}

module.exports = {
  setupSnowflakeDestination
}
