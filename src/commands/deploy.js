const { execSync } = require('child_process');
const { storeWorkspaceId } = require('../airbyte/api/storeWorkspaceId.js');
const { setupAirbyteDestination } = require('../airbyte/api/airbyteSetup.js');
const { buildSnowflakeDestination } = require('../airbyte/configObjects/buildSnowflakeDestination.js');
const { createAirbyteWarehouse } = require('../airbyte/warehouseSetup/createAirbyteWarehouse.js');

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
  const [ [ instanceId ] ] = JSON.parse(execSync(`aws ec2 describe-instances --filters "Name=key-name, Values=${keyPairName}" --query "Reservations[*].Instances[*].InstanceId"`).toString());
  return instanceId;
}

const provisionResources = (keyPairName) => {
  execSync(`aws ec2 create-key-pair --key-name ${keyPairName} --query "KeyMaterial" --output text > ${keyPairName}.pem`);
  execSync(`aws ssm put-parameter --name "/airbyte/key-pair" --value "$(cat ${keyPairName}.pem)" --type SecureString --overwrite`);
  execSync(`rm "${keyPairName}.pem"`);
  console.log('EC2 Key Pair created \u2714');

  const [VpcId] = JSON.parse(execSync(`aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[*].VpcId'`).toString()); 
  const [subnetA, subnetB] = JSON.parse(execSync(`aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VpcId}" --query 'Subnets[*].SubnetId'`).toString()); 
  
  // TODO- address where to store template files; executing from different directories error
  execSync(`aws cloudformation create-stack --template-body file://templates/airbyte-stack.yml --stack-name tapestry-${keyPairName} --parameters ParameterKey=KeyPair,ParameterValue=${keyPairName} ParameterKey=DefaultBucket,ParameterValue=${keyPairName}-bucket ParameterKey=VpcId,ParameterValue=${VpcId} ParameterKey=VpcSubnetA,ParameterValue=${subnetA} ParameterKey=VpcSubnetB,ParameterValue=${subnetB} --capabilities CAPABILITY_NAMED_IAM`);
  console.log('Stack created \u2714');
}

const connectInstance = (keyPairName) => {
  console.log('Waiting for Airbyte EC2 instance to run...');

  execSync(`aws ec2 wait instance-running --filters "Name=key-name, Values=${keyPairName}"`);

  // process.env.INSTANCE_IP = execSync(`aws ec2 describe-instances --filters "Name=key-name, Values=${KEY_PAIR}" --query "Reservations[*].Instances[*].PublicIpAddress" --output text`);
  
  const instanceId = getInstanceId(keyPairName);
  console.log('Waiting for "okay" status from Airbyte EC2 instance...');
  execSync(`aws ec2 wait instance-status-ok --instance-ids ${instanceId}`);
  
  console.log('Airbyte EC2 instance now running \u2714');
  // execSync(`ssh -i ${process.env.SSH_KEY} -L 8000:localhost:8000 -N -f ec2-user@${process.env.INSTANCE_IP}`, { stdio: 'inherit' });
}

const registerTargetGroup = (keyPairName) => {
  const [TargetGroupArn] = JSON.parse(execSync(`aws elbv2 describe-target-groups --names EC2TargetGroup --query 'TargetGroups[*].TargetGroupArn'`).toString()); 
  const instanceId = getInstanceId(keyPairName);

  execSync(`aws elbv2 register-targets --target-group-arn ${TargetGroupArn} --targets Id=${instanceId},Port=8000`)

  console.log('Waiting for "healthy" status from Target Group...')
  execSync(`aws elbv2 wait target-in-service --target-group-arn ${TargetGroupArn} --targets Id=${instanceId},Port=8000`);
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
  const loginConfirmation = [{type: 'confirm', name: 'confirmAbLogin', message: 'Please enter your email in the browser and click "continue" to create your workspace. \n Be sure to "skip onboarding step"! Confirm when you are ready.'}];

  await inquirer
    .prompt(loginConfirmation)
    .then(async ({ confirmAbLogin }) => {
      

      if (confirmAbLogin) {
        console.log("Thanks for creating your workspace!");
        
        console.log("Setting up Snowflake as a destination in Airbyte...");
        await storeWorkspaceId(publicDNS);
        const workspaceId = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/workspace-id"').toString()).Parameter.Value;
        const instanceId = await getInstanceId(keyPairName);
        const s3BucketRegion = await getS3BucketRegion(instanceId);
        
        const accessKeyId = execSync('aws configure get aws_access_key_id').toString().trim();
        const secretAccessKey = execSync('aws configure get aws_secret_access_key').toString().trim();

        const s3Info = {
          "method": "S3 Staging",
          "s3_bucket_name":  `${keyPairName}-bucket`,
          "s3_bucket_region": s3BucketRegion,
          "access_key_id": accessKeyId,
          "secret_access_key" :  secretAccessKey
        }
        
        const snowAbPass = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/ab-pass" --with-decryption').toString()).Parameter.Value;
        const snowAcctHost = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-hostname" --with-decryption').toString()).Parameter.Value;

        const destinationObj = buildSnowflakeDestination(snowAbPass, snowAcctHost, s3Info, workspaceId);
        await setupAirbyteDestination(publicDNS, destinationObj);
      }
    })
}

module.exports = async () => {
  await createAirbyteWarehouse();

  const keyPairName = randomizeKeyPairName();

  console.log('Provisioning AWS cloud resources...');
  provisionResources(keyPairName);

  console.log('Installing Airbyte on EC2 instance...')
  connectInstance(keyPairName);

  console.log('Registering target group...')
  registerTargetGroup(keyPairName);
  
  console.log('Launching Airbyte UI to enter login information...')
  storePublicDNS(keyPairName);
  const publicDNS = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
  launchPublicDNS(publicDNS);

  await connectSnowflakeToAirbyte(keyPairName, publicDNS);
  
  console.log('Deployment finished!');
};

// TODO - file too long, refactor 
// TODO - review what to log to console during deployment 