const { execSync } = require('child_process');
const { setupAirbyteDestination, storeWorkspaceId } = require('../airbyte/api-calls.js');
const { buildSnowflakeDestination } = require('../airbyte/snowflake-destination-body.js');

const inquirer = require('inquirer');

const randomizeKeyPairName = () => {
  const characters =  "abcdefghijklmnopqrstuvwxyz1234567890";
  const length = 5; 
  let randomString = ""; 
  for (let i=1; i <= length; i++) {
    let index = Math.floor(Math.random() * characters.length);
    randomString += characters[index];
  }

  return "tapestry-key-pair-" + randomString;
}

const getInstanceId = (keyPairName) => {
  console.log(keyPairName)
  const [ [ InstanceId ] ] = JSON.parse(execSync(`aws ec2 describe-instances --filters "Name=key-name, Values=${keyPairName}" --query "Reservations[*].Instances[*].InstanceId"`).toString());
  return InstanceId; 
}

const provisionResources = (keyPairName) => {
  execSync(`aws ec2 create-key-pair --key-name ${keyPairName} --query "KeyMaterial" --output text > ${keyPairName}.pem`);
  execSync(`aws ssm put-parameter --name "/airbyte/key-pair" --value "$(cat ${keyPairName}.pem)" --type SecureString --overwrite`);
  execSync(`rm "${keyPairName}.pem"`);
  console.log('EC2 Key Pair created \u2714');

  const [VpcId] = JSON.parse(execSync(`aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[*].VpcId'`).toString()); 
  const [subnetA, subnetB] = JSON.parse(execSync(`aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VpcId}" --query 'Subnets[*].SubnetId'`).toString()); 
  
  // address where to store template files; executing from different directories error
  execSync(`aws cloudformation create-stack --template-body file://templates/airbyte-stack.yml --stack-name tapestry-${keyPairName} --parameters ParameterKey=KeyPair,ParameterValue=${keyPairName} ParameterKey=DefaultBucket,ParameterValue=${keyPairName}-bucket ParameterKey=VpcId,ParameterValue=${VpcId} ParameterKey=VpcSubnetA,ParameterValue=${subnetA} ParameterKey=VpcSubnetB,ParameterValue=${subnetB} --capabilities CAPABILITY_NAMED_IAM`);
  console.log('Stack created \u2714');
}

const connectInstance = (keyPairName) => {
  console.log('Waiting for Airbyte EC2 instance to run...');

  execSync(`aws ec2 wait instance-running --filters "Name=key-name, Values=${keyPairName}"`);

  // process.env.INSTANCE_IP = execSync(`aws ec2 describe-instances --filters "Name=key-name, Values=${KEY_PAIR}" --query "Reservations[*].Instances[*].PublicIpAddress" --output text`);
  
  const InstanceId = getInstanceId(keyPairName);
  console.log('Airbyte EC2 instance now running \u2714');

  console.log('Waiting for "okay" status from Airbyte EC2 instance...');
  execSync(`aws ec2 wait instance-status-ok --instance-ids ${InstanceId}`);
  
  // execSync(`ssh -i ${process.env.SSH_KEY} -L 8000:localhost:8000 -N -f ec2-user@${process.env.INSTANCE_IP}`, { stdio: 'inherit' });
}

const registerTargetGroup = (keyPairName) => {
  const [TargetGroupArn] = JSON.parse(execSync(`aws elbv2 describe-target-groups --names EC2TargetGroup --query 'TargetGroups[*].TargetGroupArn'`).toString()); 
  const InstanceId = getInstanceId(keyPairName);

  execSync(`aws elbv2 register-targets --target-group-arn ${TargetGroupArn} --targets Id=${InstanceId},Port=8000`)

  console.log('Waiting for "healthy" status from Target Group...')
  execSync(`aws elbv2 wait target-in-service --target-group-arn ${TargetGroupArn} --targets Id=${InstanceId},Port=8000`);
}

const storePublicDNS = (keyPairName) => {
  const [ publicDNS ] = JSON.parse(execSync(`aws cloudformation describe-stacks --stack-name tapestry-${keyPairName} --query "Stacks[0].Outputs[?OutputKey=='PublicDNS'].OutputValue"`));
  execSync(`aws ssm put-parameter --name "/airbyte/public-dns" --value "http://${publicDNS}" --type String --overwrite`);
}

const launchPublicDNS = (publicDNS) => {
  console.log(publicDNS);
  execSync(`open ${publicDNS}`); //TODO - just for Mac
}

const getS3BucketRegion = async (instanceId) => {
  return JSON.parse(execSync(`aws ec2 describe-instances --instance-ids ${instanceId} --query "Reservations[0].Instances[0].Placement.AvailabilityZone"`).toString()).slice(0,-1);
}

const connectSnowflakeToAirbyte = async (keyPairName, publicDNS) => {
  const loginConfirmation = [{type: 'confirm', name: 'confirmAbLogin', message: 'Please enter your email and click "continue" to create your workspace. Confirm when you are ready.'}];

  await inquirer
    .prompt(loginConfirmation)
    .then(async ({ confirmAbLogin }) => {
      console.log(confirmAbLogin)

      if (confirmAbLogin) {
        // get workspace id
        await storeWorkspaceId(publicDNS);
        const workspaceId = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/workspace-id"').toString()).Parameter.Value;
        console.log(workspaceId)
        const instanceId = await getInstanceId(keyPairName);
        console.log(instanceId)
        const s3BucketRegion = await getS3BucketRegion(instanceId);
        console.log(s3BucketRegion)
        
        const s3Info = {
          "method": "S3 Staging",
          "s3_bucket_name":  `${keyPairName}-bucket`,
          "s3_bucket_region": s3BucketRegion,
          "access_key_id": "AKIAVWSKU6ZYMDQU7JWK",
          "secret_access_key" :  "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"
        }
        
        // need to grab snowAbPass and snowAcctHost from param store /snowflake/ab-pass
        const snowAbPass = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/ab-pass" --with-decryption').toString()).Parameter.Value;
        const snowAcctHost = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-hostname" --with-decryption').toString()).Parameter.Value;

        const destinationObj = buildSnowflakeDestination(snowAbPass, snowAcctHost, s3Info, workspaceId);
        await setupAirbyteDestination(publicDNS, destinationObj);
      }
    })
}

module.exports = async () => {
  const keyPairName = randomizeKeyPairName();

  console.log('Provisioning cloud resources...');
  provisionResources(keyPairName);

  console.log('Connecting Airbyte to EC2 instance...')
  connectInstance(keyPairName);

  console.log('Registering target group...')
  registerTargetGroup(keyPairName);
  
  console.log(`Launching Airbyte UI to enter login information...`)
  storePublicDNS(keyPairName);
  const publicDNS = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
  launchPublicDNS(publicDNS);

  await connectSnowflakeToAirbyte(keyPairName, publicDNS);
  
  console.log('Deployment finished!');
};
