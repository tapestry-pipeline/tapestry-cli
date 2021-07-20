const inquirer = require('inquirer');
const { execSync } = require('child_process');

const validateInput = async (input) => {
   if (input === '') {
     return 'Field required! Must provide input!'
   };
   return true;
}

const questions = [
  { type: 'input', name: 'projectName', message: 'Project name:', default: 'tapestry-project'},
  { type: 'input', name: 'snowflakeAcct', message: 'Snowflake Account Host: (i.e. "dla27293.us-east-1")', validate: validateInput},
  { type: 'input', name: 'snowflakeUsername', message: 'Snowflake Account Username:', validate: validateInput },
  { type: 'password', name: 'snowflakePass', message: 'Snowflake Account Password:', validate: validateInput, mask: '*' },
  { type: 'password', name: 'snowflakePass', message: 'Snowflake Airbyte Database/Warehouse Password:', validate: validateInput, mask: '*' },
];

const gatherInfo = async () => {
  console.log('Please provide the following details:')
  await inquirer
    .prompt(questions)
    .then(answers => {
      execSync(`aws ssm put-parameter --name "/project-name" --value "${answers.projectName}" --type String --overwrite`);
      execSync(`aws ssm put-parameter --name "/snowflake/acct-name" --value "${answers.snowflakeAcct}" --type SecureString --overwrite`);
      execSync(`aws ssm put-parameter --name "/snowflake/usrname" --value "${answers.snowflakeUsername}" --type SecureString --overwrite`);
      execSync(`aws ssm put-parameter --name "/snowflake/pass" --value "${answers.snowflakePass}" --type SecureString --overwrite`);
    })
    .catch(error => console.log(error));
}

const provisionFolders = async () => {
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  console.log(projectName);
  // execSync(``);

  // $ arr=( mydir/{colors/{basic/{red,blue,green},blended/{yellow,orange,pink}},shape/{circle,square,cube},animals/{mammals/{platipus,bat,dog},reptiles/{snakes,crocodile,lizard}}} )
  // $ for i in "${arr[@]}"; do  mkdir -p "${i%/*}" && touch "$i"; done
}

module.exports = async () => {
  await gatherInfo();
  // await provisionFolders();
};

// const password = JSON.parse(execSync(`aws ssm get-parameter --name "/snowflake/pass" --with-decryption`).toString()).Parameter.Value;

