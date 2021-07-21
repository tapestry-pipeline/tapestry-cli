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
  // { type: 'input', name: 'snowHostname', message: 'Snowflake Account Hostname: (i.e. "<hostname>.snowflakecomputing.com")', validate: validateInput},
  // { type: 'input', name: 'snowUsername', message: 'Snowflake Account Login Name:', validate: validateInput },
  // { type: 'password', name: 'snowAcctPass', message: 'Snowflake Account Password:', validate: validateInput, mask: '*' },
  // { type: 'password', name: 'snowAbPass', message: 'Tapestry will create an AIRBYTE WAREHOUSE and AIRBYTE USER during setup. \
  //                                                   What password would you like to use for AIRBYTE USER?', validate: validateInput, mask: '*' },
];

const gatherInfo = async () => {
  console.log('Please provide the following details:')
  await inquirer
    .prompt(questions)
    .then(async answers => {
      execSync(`aws ssm put-parameter --name "/project-name" --value "${answers.projectName}" --type String --overwrite`);
      // execSync(`aws ssm put-parameter --name "/snowflake/acct-hostname" --value "${answers.snowAcctHost}" --type SecureString --overwrite`);
      // execSync(`aws ssm put-parameter --name "/snowflake/acct-username" --value "${answers.snowAcctUser}" --type SecureString --overwrite`);
      // execSync(`aws ssm put-parameter --name "/snowflake/acct-pass" --value "${answers.snowAcctPass}" --type SecureString --overwrite`);
      // execSync(`aws ssm put-parameter --name "/snowflake/ab-pass" --value "${answers.snowAbPass}" --type SecureString --overwrite`);
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

// gatherInfo();

module.exports = async () => {
  await gatherInfo();;
  // await airbyteInfo();
  // await provisionFolders();
}