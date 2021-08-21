const buildSnowflakeDestination = (password, hostname, s3Info, workspaceId) => {
  return {
    "destinationDefinitionId": "424892c4-daac-4491-b35d-c6688ba547ba",
    "connectionConfiguration": {
      "loading_method": s3Info,
      "password": password,
      "username": "TAPESTRY_USER",
      "schema": "TAPESTRY_SCHEMA",
      "database": "TAPESTRY_DATABASE",
      "warehouse": "TAPESTRY_WAREHOUSE",
      "role": "TAPESTRY_ROLE",
      "host": `${hostname}.snowflakecomputing.com`
    },
    "workspaceId": workspaceId,
    "name": "Snowflake Destination"
  }
}

module.exports = {
  buildSnowflakeDestination
}
