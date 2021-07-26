const { execSync } = require('child_process');

const createAirbyteStack = (projectName, keyPairName, randomString) => {
  const [VpcId] = JSON.parse(execSync(`aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[*].VpcId'`).toString());
  const [subnetA, subnetB] = JSON.parse(execSync(`aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VpcId}" --query 'Subnets[*].SubnetId'`).toString());
<<<<<<< HEAD
  const airbyteStackName = `${projectName}-airbyte`;
  
  console.log('Creating Airbyte stack...');
  execSync(`aws cloudformation create-stack --template-body file://airbyte/airbyte-stack.yaml --stack-name ${airbyteStackName} --parameters ParameterKey=KeyPair,ParameterValue=${keyPairName} ParameterKey=DefaultBucket,ParameterValue=${projectName}-bucket-${randomString} ParameterKey=VpcId,ParameterValue=${VpcId} ParameterKey=VpcSubnetA,ParameterValue=${subnetA} ParameterKey=VpcSubnetB,ParameterValue=${subnetB} --capabilities CAPABILITY_NAMED_IAM`);
=======
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  const airbyteStackName = `${projectName}-airbyte`;

  // TODO- address where to store template files; executing from different directories error
  console.log('Creating Airbyte stack...');
  execSync(`aws cloudformation create-stack --template-body file://../tapestry-cli/templates/airbyte-stack.yml --stack-name ${airbyteStackName} --parameters ParameterKey=KeyPair,ParameterValue=${keyPairName} ParameterKey=DefaultBucket,ParameterValue=${keyPairName}-bucket ParameterKey=VpcId,ParameterValue=${VpcId} ParameterKey=VpcSubnetA,ParameterValue=${subnetA} ParameterKey=VpcSubnetB,ParameterValue=${subnetB} --capabilities CAPABILITY_NAMED_IAM`);
  execSync(`aws ssm put-parameter --name "/airbyte/stack-name" --value "${airbyteStackName}" --type String --overwrite`);

>>>>>>> 8963c563d425e63d21872cfcc5961b956d58aa17
  execSync(`aws cloudformation wait stack-create-complete --stack-name ${airbyteStackName}`);
  console.log('Stack created \u2714');
}

module.exports = {
  createAirbyteStack
}