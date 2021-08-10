const { execSync } = require('child_process');
const inquirer = require('inquirer');
const { storeWorkspaceId } = require('../api/storeWorkspaceId.js');
const { setupAirbyteDestination } = require('./airbyteSetup.js');
const { buildSnowflakeDestination } = require('../configObjects/buildSnowflakeDestination.js');
const { getInstanceId } = require('../../aws/getInstanceId.js'); 
const { getS3BucketCredentials } = require('../../aws/getS3BucketCredentials.js');
const log = require('../../utils/logger.js').logger;
const chalk = require('chalk');

const setupSnowflakeDestination = async (keyPairName, publicDNS, randomString) => {
  console.log(`${chalk.bold.cyan('Please enter your email in the browser and click "continue" to create your workspace. Be sure to "Skip Onboarding"')}`);

  const loginConfirmation = [
    { type: 'confirm', name: 'confirmAbLogin', message: 'Please confirm here when you are ready.' },
  ];

  await inquirer
    .prompt(loginConfirmation)
    .then(async ({ confirmAbLogin }) => {
      if (confirmAbLogin) {
        console.log(`${chalk.bold.cyan("Thank you for creating your workspace!")}`);
        
        log("Setting up Snowflake as a destination in Airbyte... (this will take approximately 1-2 min)");
        await storeWorkspaceId(publicDNS);
        
        const workspaceId = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/workspace-id"').toString()).Parameter.Value;
        const instanceId = getInstanceId(keyPairName);
        const s3BucketCredentials = getS3BucketCredentials(randomString, instanceId);
        const snowAbPass = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/ab-user-pass" --with-decryption').toString()).Parameter.Value;
        const snowAcctHost = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-hostname" --with-decryption').toString()).Parameter.Value;

        const destinationObj = buildSnowflakeDestination(snowAbPass, snowAcctHost, s3BucketCredentials, workspaceId);
        await setupAirbyteDestination(publicDNS, destinationObj);
      }
    })
}

module.exports = {
  setupSnowflakeDestination
}
