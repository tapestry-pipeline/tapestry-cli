const Snowflake = require('snowflake-promise').Snowflake;

async function main() {
  const snowflake = new Snowflake({
    account: "dla27293.us-east-1",
    username: "fantasticfour",
    password: "Fantastic1258$"
  }, {
    logSql: console.log
  });

  await snowflake.connect();

  let sql = [
    "begin;",
    "use role securityadmin;",
    "create role if not exists ABCDE_ROLE",
    "grant role ABCDE_ROLE to role SYSADMIN;",
    "create user if not exists ABCDE_USER password = password default_role = ABCDE_ROLE default_warehouse = ABCDE_WAREHOUSE;",
    "grant role ABCDE_ROLE to user ABCDE_USER;",
    "use role sysadmin;",
    "create warehouse if not exists ABCDE_WAREHOUSE warehouse_size = xsmall warehouse_type = standard auto_suspend = 60 auto_resume = true initially_suspended = true;",
    "create database if not exists ABCDE_DATABASE;",
    "grant USAGE on warehouse ABCDE_WAREHOUSE to role ABCDE_ROLE;",
    "grant OWNERSHIP on database ABCDE_DATABASE to role ABCDE_ROLE;",
    "commit;",
    "begin;",
    "USE DATABASE ABCDE_DATABASE;",
    "CREATE SCHEMA IF NOT EXISTS ABCDE_SCHEMA;",
    "commit;",
    "begin;",
    "grant OWNERSHIP on schema ABCDE_SCHEMA to role ABCDE_ROLE;",
    "commit;"
    ]
    
  for (const sqlStatement of sql) {
    await snowflake.execute(sqlStatement);
  }
}

main(); 