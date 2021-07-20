const buildSnowflakeDestination = (password, hostname, s3Info, workspaceId) => {
  return {
    "destinationDefinitionId": "424892c4-daac-4491-b35d-c6688ba547ba",
    "connectionConfiguration": {
      "loading_method": s3Info,
      "password": password,
      "username": "AIRBYTE_USER",
      "schema": "AIRBYTE_SCHEMA",
      "database": "AIRBYTE_DATABASE",
      "warehouse": "AIRBYTE_WAREHOUSE",
      "role": "AIRBYTE_ROLE",
      "host": hostname
    },
    "workspaceId": workspaceId,
    "name": "Snowflake API Test"
  }
}

// snowflake body info template:
// {
//   "destinationDefinitionId": "424892c4-daac-4491-b35d-c6688ba547ba",
//   "connectionConfiguration": {
//     "loading_method": {
//       "method": "S3 Staging",
//       "s3_bucket_name": "test-airbyte-bkt",
//       "s3_bucket_region": "us-east-1",
//       "access_key_id": "AKIAVNPHB36FE4Z6VTW4",
//       "secret_access_key": "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"
//     },
//     "password": "password",
//     "username": "AIRBYTE_USER",
//     "schema": "AIRBYTE_SCHEMA",
//     "database": "AIRBYTE_DATABASE",
//     "warehouse": "AIRBYTE_WAREHOUSE",
//     "role": "AIRBYTE_ROLE",
//     "host": "DLA27293.us-east-1.snowflakecomputing.com"
//   },
//   "workspaceId": "5ae6b09b-fdec-41af-aaf7-7d94cfc33ef6",
//   "name": "Snowflake API Test"
//  }


 module.exports = {
  buildSnowflakeDestination
 }
