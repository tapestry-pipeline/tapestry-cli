const { execSync } = require('child_process');

// const snowAcctHost = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-hostname" --with-decryption').toString()).Parameter.Value;
// const snowUserAcctUser = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-username" --with-decryption').toString()).Parameter.Value;
// const snowAbPass = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/ab-pass" --with-decryption').toString()).Parameter.Value;


const snowAcctHost = "dla27293.us-east-1";
const snowUserAcctUser = "fantasticfour";
const snowAbPass = "Fantastic1258$";


module.exports =  {
  snowAcctHost,
  snowUserAcctUser,
  snowAbPass
}
