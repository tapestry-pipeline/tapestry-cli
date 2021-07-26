const { execSync } = require('child_process');

const createAirbyteStack = (projectName, keyPairName, randomString) => {
  const [VpcId] = JSON.parse(execSync(`aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[*].VpcId'`).toString());
  const [subnetA, subnetB] = JSON.parse(execSync(`aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VpcId}" --query 'Subnets[*].SubnetId'`).toString());
  const airbyteStackName = `${projectName}-airbyte`;
  
  console.log('Creating Airbyte stack...');
  execSync(`aws cloudformation create-stack --template-body file://airbyte/airbyte-stack.yaml --stack-name ${airbyteStackName} --parameters ParameterKey=KeyPair,ParameterValue=${keyPairName} ParameterKey=DefaultBucket,ParameterValue=${projectName}-bucket-${randomString} ParameterKey=VpcId,ParameterValue=${VpcId} ParameterKey=VpcSubnetA,ParameterValue=${subnetA} ParameterKey=VpcSubnetB,ParameterValue=${subnetB} --capabilities CAPABILITY_NAMED_IAM`);
  execSync(`aws cloudformation wait stack-create-complete --stack-name ${airbyteStackName}`);
  execSync(`aws ssm put-parameter --name "/airbyte/stack-name" --value "${airbyteStackName}" --type String --overwrite`);
  console.log('Stack created \u2714');
}

module.exports = {
  createAirbyteStack
}