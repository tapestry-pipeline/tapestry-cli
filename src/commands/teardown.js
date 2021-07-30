const { execSync } = require("child_process");
const log = require('../utils/logger.js').logger

const teardown = () => {
  // get stack names
  const airbyteStackName = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/stack-name"').toString()).Parameter.Value;
  const grouparooStackName = JSON.parse(execSync('aws ssm get-parameter --name "/grouparoo/stack-name"').toString()).Parameter.Value;

  // delete stacks
  log('Deleting Airbyte stack... (this will take approximately 2 min)');
  execSync(`aws cloudformation delete-stack --stack-name ${airbyteStackName}`);
  execSync(`aws cloudformation wait stack-delete-complete --stack-name ${airbyteStackName}`);
  log('Airbyte stack deleted!');

  log('Deleting Grouparoo stack... (this will take approximately 10 min)');
  execSync(`aws cloudformation delete-stack --stack-name ${grouparooStackName}`);
  execSync(`aws cloudformation wait stack-delete-complete --stack-name ${grouparooStackName}`);
  log('Grouparoo stack deleted!');

  // remove ECR repo
  log('Removing Grouparoo repository from ECR...');
  execSync('aws ecr delete-repository --repository-name grouparoo --force');

  // remove key-pair
  log('Removing project key-pair...');
  const keyPairName = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/key-pair-name"').toString()).Parameter.Value;
  execSync(`aws ec2 delete-key-pair --key-name ${keyPairName}`);
}

module.exports = () => {
  log('Teardown process initiated...');
  teardown();
  log('Teardown complete!');
}