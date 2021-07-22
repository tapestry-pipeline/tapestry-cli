const { execSync } = require('child_process');
const { templateFilePath } = require('../../templates/templateFilePath.js'); 

const createAirbyteStack = (keyPairName) => {
  const [VpcId] = JSON.parse(execSync(`aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[*].VpcId'`).toString()); 
  const [subnetA, subnetB] = JSON.parse(execSync(`aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VpcId}" --query 'Subnets[*].SubnetId'`).toString()); 
  // TODO- address where to store template files; executing from different directories error
  execSync(`aws cloudformation create-stack --template-body file://${templateFilePath}/airbyte-stack.yml --stack-name tapestry-${keyPairName} --parameters ParameterKey=KeyPair,ParameterValue=${keyPairName} ParameterKey=DefaultBucket,ParameterValue=${keyPairName}-bucket ParameterKey=VpcId,ParameterValue=${VpcId} ParameterKey=VpcSubnetA,ParameterValue=${subnetA} ParameterKey=VpcSubnetB,ParameterValue=${subnetB} --capabilities CAPABILITY_NAMED_IAM`);
  console.log('Stack created \u2714');
}

module.exports = {
  createAirbyteStack 
}