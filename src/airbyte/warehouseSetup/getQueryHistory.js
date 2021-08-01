const Snowflake = require('snowflake-promise').Snowflake;
const { execSync } = require('child_process');

async function getQueryHistory() {
  const account = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-hostname" --with-decryption').toString()).Parameter.Value;
  const username = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-username" --with-decryption').toString()).Parameter.Value;
  const password = JSON.parse(execSync('aws ssm get-parameter --name "/snowflake/acct-pass" --with-decryption').toString()).Parameter.Value;
 
  const snowflake = new Snowflake({ account, username, password });
  await snowflake.connect();

  let result = await snowflake.execute('SELECT "QUERY_TEXT", "SCHEMA_NAME", "QUERY_TYPE", "EXECUTION_STATUS", "ERROR_CODE", "START_TIME", "END_TIME", "TOTAL_ELAPSED_TIME" FROM table(TAPESTRY_DATABASE.information_schema.query_history(end_time_range_start=>dateadd(HOUR, -6, current_timestamp()), current_timestamp()))"'); 
  console.log(result); 
}

getQueryHistory(); 

module.exports = {
  getQueryHistory
}