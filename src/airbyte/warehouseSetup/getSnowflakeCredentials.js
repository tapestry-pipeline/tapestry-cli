const inquirer = require('inquirer');
const { execSync } = require('child_process');

const validateInput = async (input) => {
  if (input === '') {
    return 'Field required! Must provide input!'
  };
  return true;
}

const getSnowflakeCredentials = async () => {
  console.log('Now we need to get some information about your Snowflake credentials:');

  const questions = [
    { type: 'input', name: 'snowHostname', message: 'Snowflake Account Hostname (e.g., "<hostname>.snowflakecomputing.com"):', validate: validateInput },
    { type: 'input', name: 'snowUsername', message: 'Snowflake Account Login Name:', validate: validateInput },
    { type: 'password', name: 'snowAcctPass', message: 'Snowflake Account Password:', validate: validateInput, mask: '*' },
    { type: 'password', name: 'snowAbUserPass', message: 'Tapestry will create an TAPESTRY_WAREHOUSE and TAPESTRY_USER during setup. \n What password would you like to use for TAPESTRY_USER?', validate: validateInput, mask: '*' },
  ];

  await inquirer
    .prompt(questions)
    .then(async answers => {
      execSync(`aws ssm put-parameter --name "/snowflake/acct-hostname" --value "${answers.snowHostname}" --type SecureString --overwrite`);
      execSync(`aws ssm put-parameter --name "/snowflake/acct-username" --value "${answers.snowUsername}" --type SecureString --overwrite`);
      execSync(`aws ssm put-parameter --name "/snowflake/acct-pass" --value "${answers.snowAcctPass}" --type SecureString --overwrite`);
      execSync(`aws ssm put-parameter --name "/snowflake/ab-user-pass" --value "${answers.snowAbUserPass}" --type SecureString --overwrite`);
    })
    .catch(error => console.log(error));
}


module.exports = {
  getSnowflakeCredentials
}
