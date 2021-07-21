const buildSqlScript = (password) => {
  return [
    "begin;",
    "use role securityadmin;",
    "create role if not exists AIRBYTE_ROLE",
    "grant role AIRBYTE_ROLE to role SYSADMIN;",
    `create user if not exists AIRBYTE_USER password = ${password} default_role = AIRBYTE_ROLE default_warehouse = AIRBYTE_WAREHOUSE;`,
    "grant role AIRBYTE_ROLE to user AIRBYTE_USER;",
    "use role sysadmin;",
    "create warehouse if not exists AIRBYTE_WAREHOUSE warehouse_size = xsmall warehouse_type = standard auto_suspend = 60 auto_resume = true initially_suspended = true;",
    "create database if not exists AIRBYTE_DATABASE;",
    "grant USAGE on warehouse AIRBYTE_WAREHOUSE to role AIRBYTE_ROLE;",
    "grant OWNERSHIP on database AIRBYTE_DATABASE to role AIRBYTE_ROLE;",
    "commit;",
    "begin;",
    "USE DATABASE AIRBYTE_DATABASE;",
    "CREATE SCHEMA IF NOT EXISTS AIRBYTE_SCHEMA;",
    "commit;",
    "begin;",
    "grant OWNERSHIP on schema AIRBYTE_SCHEMA to role AIRBYTE_ROLE;",
    "commit;"
  ];
}

module.exports = {
  buildSqlScript
}