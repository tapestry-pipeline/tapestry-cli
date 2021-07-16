const { execSync } = require('child_process');

const KEY_PAIR = 'tapestry-key-pair-17';

const provisionResources = () => {
  execSync(`aws ec2 create-key-pair --key-name ${KEY_PAIR} --query "KeyMaterial" --output text > ${KEY_PAIR}.pem`);
  process.env.SSH_KEY = `./config/${KEY_PAIR}.pem`;

  execSync(`chmod 400 ${process.env.SSH_KEY}`);
  console.log('EC2 Key Pair created \u2714');

  execSync(`aws cloudformation create-stack --template-body file://../../templates/airbyte-stack.yaml --stack-name tap-ab-test --parameters ParameterKey=KeyPair,ParameterValue=${KEY_PAIR} ParameterKey=DefaultBucket,ParameterValue=test-tags-b --capabilities CAPABILITY_NAMED_IAM`);
  console.log('Stack created \u2714');
}

const connectInstance = () => {
  console.log('Waiting for Airbyte EC2 instance to run...');

  execSync(`aws ec2 wait instance-running --filters "Name=key-name, Values=${KEY_PAIR}"`);

  // process.env.INSTANCE_IP = execSync(`aws ec2 describe-instances --filters "Name=key-name, Values=${KEY_PAIR}" --query "Reservations[*].Instances[*].PublicIpAddress" --output text`);
  
  process.env.INSTANCE_ID = execSync(`aws ec2 describe-instances --filters "Name=key-name, Values=${KEY_PAIR}" --query "Reservations[*].Instances[*].[InstanceId]" --output text`);
  console.log('Airbyte EC2 instance now running \u2714');

  console.log('Waiting for "okay" status from Airbyte EC2 instance...');
  execSync(`aws ec2 wait instance-status-ok --instance-ids ${process.env.INSTANCE_ID}`);
  
  // execSync(`ssh -i ${process.env.SSH_KEY} -L 8000:localhost:8000 -N -f ec2-user@${process.env.INSTANCE_IP}`, { stdio: 'inherit' });
}

module.exports = () => {
  console.log('Provisioning cloud resources...');
  provisionResources();

  console.log('Connecting Airbyte to EC2 instance...')
  connectInstance();

  console.log('Deployment finished!');
};
