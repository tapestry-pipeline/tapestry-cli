const { execSync } = require('child_process');

const connectInstance = (keyPairName) => {
  console.log('Waiting for Airbyte EC2 instance to run...');

  execSync(`aws ec2 wait instance-running --filters "Name=key-name, Values=${keyPairName}"`);

  const instanceId = getInstanceId(keyPairName);
  console.log('Waiting for "okay" status from Airbyte EC2 instance...');
  execSync(`aws ec2 wait instance-status-ok --instance-ids ${instanceId}`);
  
  console.log('Airbyte EC2 instance now running \u2714');
}

module.exports = {
  connectInstance
}
