const { execSync } = require("child_process");
const fs = require('fs');
const { envLocalTemplate } = require("../../templates/envLocalTemplate.js");

const envWriter = () => {
  const mode = JSON.parse(execSync('aws ssm get-parameter --name "/tapestry/mode"').toString()).Parameter.Value;
  const snowflakeHostAccount = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-hostname" --with-decryption').toString()).Parameter.Value;
  const snowflakeAccountUsername = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-username" --with-decryption').toString()).Parameter.Value;
  const snowflakeAccountPassword = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-pass" --with-decryption').toString()).Parameter.Value;

  let snowflake = `SNOW_HOSTNAME="${snowflakeHostAccount}"\n` + `SNOW_ACCOUNT_USERNAME="${snowflakeAccountUsername}"\n` + `SNOW_ACCOUNT_PASSWORD="${snowflakeAccountPassword}"\n`;

  if (mode === 'deploy') {
    fs.writeFileSync('.env', snowflake + envLocalTemplate, 'utf8');
  } else {
    const mailchimpApiKey = JSON.parse(execSync('aws ssm get-parameter --name "/mailchimp/apiKey" --with-decryption').toString()).Parameter.Value;
    const mailchimpListId = JSON.parse(execSync('aws ssm get-parameter --name "/mailchimp/listId" --with-decryption').toString()).Parameter.Value;
    let mailChimp = `MAILCHIMP_API_KEY="${mailchimpApiKey}"\nMAILCHIMP_LIST_ID="${mailchimpListId}"\n`;

    fs.writeFileSync('.env', snowflake + mailChimp + envLocalTemplate, 'utf8');
  }
}

envWriter();


module.exports = {
  envWriter
}
