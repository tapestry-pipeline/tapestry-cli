const buildSqlScript = (password) => {
  return [
    "begin;",
    "use role securityadmin;",
    "create role if not exists TAPESTRY_ROLE",
    "grant role TAPESTRY_ROLE to role SYSADMIN;",
    `create user if not exists TAPESTRY_USER password = ${password} default_role = TAPESTRY_ROLE default_warehouse = TAPESTRY_WAREHOUSE;`,
    "grant role TAPESTRY_ROLE to user TAPESTRY_USER;",
    "use role sysadmin;",
    "create warehouse if not exists TAPESTRY_WAREHOUSE warehouse_size = xsmall warehouse_type = standard auto_suspend = 60 auto_resume = true initially_suspended = true;",
    "create database if not exists TAPESTRY_DATABASE;",
    "grant USAGE on warehouse TAPESTRY_WAREHOUSE to role TAPESTRY_ROLE;",
    "grant OWNERSHIP on database TAPESTRY_DATABASE to role TAPESTRY_ROLE;",
    "commit;",
    "begin;",
    "USE DATABASE TAPESTRY_DATABASE;",
    "CREATE SCHEMA IF NOT EXISTS TAPESTRY_SCHEMA;",
    "commit;",
    "begin;",
    "grant OWNERSHIP on schema TAPESTRY_SCHEMA to role TAPESTRY_ROLE;",
    "commit;",
    "begin;",
    "USE DATABASE TAPESTRY_DATABASE;",
    "CREATE SCHEMA IF NOT EXISTS DBT_TAPESTRY;",
    "commit;",
    "begin;",
    "grant OWNERSHIP on schema DBT_TAPESTRY to role TAPESTRY_ROLE;",
    "commit;",
    "begin;",
    "USE DATABASE TAPESTRY_DATABASE;",
    "USE SCHEMA DBT_TAPESTRY;",
    "create table EMAIL_MODEL(EMAIL string, FNAME string, LNAME string);",
    "commit;",
    "begin",
    "grant OWNERSHIP on table EMAIL_MODEL to role TAPESTRY_ROLE;",
    "commit;"
  ];
}

module.exports = {
  buildSqlScript
}