const { execSync } = require("child_process");
const fs = require('fs');
// require('dotenv').config()
// const account = process.env.SNOW_HOSTNAME

  


const envWriter = () => {
  // const host = 'dla27293.us-east-1';
  const snowflakeHostAccount = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-hostname" --with-decryption').toString()).Parameter.Value;
  const snowflakeAccountUsername = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-username" --with-decryption').toString()).Parameter.Value;
  const snowflakeAccountPassword = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-pass" --with-decryption').toString()).Parameter.Value;

  const snowflake = `SNOW_HOSTNAME="${snowflakeHostAccount}"\n` + `SNOW_ACCOUNT_USERNAME="${snowflakeAccountUsername}"\n` + `SNOW_ACCOUNT_PASSWORD=${snowflakeAccountPassword}\n`;

  fs.writeFileSync('.env', snowflake, 'utf8');
}

envWriter();


module.exports = {
  envWriter
}
