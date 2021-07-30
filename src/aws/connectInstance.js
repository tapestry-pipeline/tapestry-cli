const { execSync } = require('child_process');
const { getInstanceId } = require('./getInstanceId');
const log = require('../utils/logger.js').logger;

const connectInstance = (keyPairName) => {
  log('Waiting for Airbyte EC2 instance to run... (this will take approximately 30 sec)');

  execSync(`aws ec2 wait instance-running --filters "Name=key-name, Values=${keyPairName}"`);

  const instanceId = getInstanceId(keyPairName);
  log('Waiting for "okay" status from Airbyte EC2 instance... (this will take approximately 2 min)');
  execSync(`aws ec2 wait instance-status-ok --instance-ids ${instanceId}`);
  
  log('Airbyte EC2 instance now running!');
}

module.exports = {
  connectInstance
}
