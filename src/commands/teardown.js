const { execSync } = require("child_process");
const inquirer = require('inquirer');
const chalk = require('chalk');
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

module.exports = async () => {
  console.log(`${chalk.bold.cyan('WARNING: This will permanently delete the majority of your Tapestry AWS resources!')}`);

  const confirmTeardown = [
    { type: 'confirm', name: 'confirmation', message: 'Are you sure you would like to continue?', },
  ];

  await inquirer
    .prompt(confirmTeardown)
    .then(({confirmation}) => {
      if (confirmation) {
        log('Teardown process initiated...');
        teardown();
        log('Teardown complete!');
      }
    });
}