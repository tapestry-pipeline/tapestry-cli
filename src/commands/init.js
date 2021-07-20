const inquirer = require('inquirer');
const { execSync } = require('child_process');
const { setupAirbyte, getWorkspaceId } = require('../airbyte/api-calls.js');
const { buildSnowflakeDestination } = require('../airbyte/snowflake-destination-body.js');


const validateInput = async (input) => {
   if (input === '') {
     return 'Field required! Must provide input!'
   };
   return true;
}

const questions = [
  { type: 'input', name: 'projectName', message: 'Project name:', default: 'tapestry-project'},
  { type: 'input', name: 'snowAcctHost', message: 'Snowflake Account Host: (i.e. "dla27293.us-east-1")', validate: validateInput},
  { type: 'input', name: 'snowAcctUser', message: 'Snowflake Account Username:', validate: validateInput },
  { type: 'password', name: 'snowAcctPass', message: 'Snowflake Account Password:', validate: validateInput, mask: '*' },
  { type: 'password', name: 'snowAbPass', message: 'Snowflake Airbyte Database/Warehouse Password:', validate: validateInput, mask: '*' }, 
];



const gatherInfo = async () => {
  console.log('Please provide the following details:')
  await inquirer
    .prompt(questions)
    .then(async answers => {
      execSync(`aws ssm put-parameter --name "/project-name" --value "${answers.projectName}" --type String --overwrite`);
      execSync(`aws ssm put-parameter --name "/snowflake/acct-hostname" --value "${answers.snowAcctHost}" --type SecureString --overwrite`);
      execSync(`aws ssm put-parameter --name "/snowflake/acct-username" --value "${answers.snowAcctUser}" --type SecureString --overwrite`);
      execSync(`aws ssm put-parameter --name "/snowflake/acct-pass" --value "${answers.snowAcctPass}" --type SecureString --overwrite`);
      execSync(`aws ssm put-parameter --name "/snowflake/ab-pass" --value "${answers.snowAbPass}" --type SecureString --overwrite`);
    })
    .catch(error => console.log(error));
}

// "schedule": {
//   "units": "30",
//   "timeUnit": "minutes"
// },

// const provisionFolders = async () => {
//   const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
//   console.log(projectName);
//   execSync(``);

//   $ arr=( mydir/{colors/{basic/{red,blue,green},blended/{yellow,orange,pink}},shape/{circle,square,cube},animals/{mammals/{platipus,bat,dog},reptiles/{snakes,crocodile,lizard}}} )
//   $ for i in "${arr[@]}"; do  mkdir -p "${i%/*}" && touch "$i"; done
// }

module.exports = async () => {
  await gatherInfo();;
  // await airbyteInfo();
  // await provisionFolders();
}