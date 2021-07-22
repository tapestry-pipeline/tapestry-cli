const Snowflake = require('snowflake-promise').Snowflake;
const { getSnowflakeCredentials } = require('./getSnowflakeCredentials.js');
const { buildSqlScript } = require('./buildSqlScript.js');
const { execSync } = require('child_process');

async function createAirbyteWarehouse() {
  await getSnowflakeCredentials();
  
  const account = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-hostname" --with-decryption').toString()).Parameter.Value;
  const username = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-username" --with-decryption').toString()).Parameter.Value;
  const password = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-pass" --with-decryption').toString()).Parameter.Value;

  console.log('Setting up Airbyte Warehouse in Snowflake...');
  const snowflake = new Snowflake({ account, username, password }, { logSql: console.log });

  await snowflake.connect();

  const abUserPassword = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/ab-user-pass" --with-decryption').toString()).Parameter.Value;
  const sqlScript = buildSqlScript(abUserPassword);
  for (const sqlStatement of sqlScript) {
    await snowflake.execute(sqlStatement);
  }
}

module.exports = {
  createAirbyteWarehouse
}