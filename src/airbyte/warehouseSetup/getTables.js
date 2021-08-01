const Snowflake = require('snowflake-promise').Snowflake;
const { execSync } = require('child_process');

async function getTables(schema) {
  const account = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-hostname" --with-decryption').toString()).Parameter.Value;
  const username = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-username" --with-decryption').toString()).Parameter.Value;
  const password = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-pass" --with-decryption').toString()).Parameter.Value;
 
  const snowflake = new Snowflake({ account, username, password });
  await snowflake.connect();

  let result = await snowflake.execute(`SHOW TABLES in "TAPESTRY_DATABASE"."${schema}";`); 
  const tableNames = result.map(table => table.name); 
  const length = result.length; 

  return { tableNames, length }; 
}

module.exports = {
  getTables
}