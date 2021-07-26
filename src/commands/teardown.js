const { execSync } = require("child_process");

const teardown = () => {
  // get stack names
  const airbyteStackName = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/stack-name"').toString()).Parameter.Value;
  const grouparooStackName = JSON.parse(execSync('aws ssm get-parameter --name "/grouparoo/stack-name"').toString()).Parameter.Value;

  // delete stacks
  console.log('Deleting Airbyte stack...');
  execSync(`aws cloudformation delete-stack --stack-name ${airbyteStackName}`);
  execSync(`aws cloudformation wait stack-delete-complete --stack-name ${airbyteStackName}`);
  console.log('Airbyte stack deleted!');

  console.log('Deleting Grouparoo stack...');
  execSync(`aws cloudformation delete-stack --stack-name ${grouparooStackName}`);
  execSync(`aws cloudformation wait stack-delete-complete --stack-name ${grouparooStackName}`);
  console.log('Grouparoo stack deleted!');

  // remove ECR repo
  console.log('Removing Grouparoo repository from ECR...');
  execSync('aws ecr delete-repository --repository-name grouparoo --force');

  // remove key-pair
  console.log('Removing project key-pair...');
  const keyPairName = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/key-pair-name"').toString()).Parameter.Value;
  execSync(`aws ec2 delete-key-pair --key-name ${keyPairName}`);
}

module.exports = () => {
  console.log('Teardown process initiated...');
  teardown();
  console.log('Teardown complete!');
}