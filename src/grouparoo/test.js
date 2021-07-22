// const inquirer = require('inquirer');
const { execSync } = require('child_process');

const getAccountId = () => {
  return  JSON.parse(execSync(`aws sts get-caller-identity`)).Account;
}

let accountId = getAccountId();
let region = execSync(`aws configure get region`).toString().trim();
console.log(region)


execSync(`aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin "${accountId}.dkr.ecr.${region}.amazonaws.com"`, {stdio:'inherit'});


docker pull aws_account_id.dkr.ecr.us-west-2.amazonaws.com/amazonlinux:latest