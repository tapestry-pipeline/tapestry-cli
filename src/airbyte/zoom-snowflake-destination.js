localhost:8000/api/v1/connections/create

{
	"name": "Salesforce to Snowflake",
	"namespaceDefinition": "source",
	"namespaceFormat": "${SOURCE_NAMESPACE}",
	"prefix": "SF_API_",
	"sourceId": "2714f42d-82e4-4036-a4b0-475ba084fa2f",
	"destinationId": "4f28af43-438a-425d-bffd-4d9b2c3af372",
	"operationIds": [
		"cc15aa1e-f62f-4733-96dc-1eee3995fd1a"
	],



- stream:
name: "users"
json_schema:
  properties:
    id:
      type:
      - "string"
    first_name:
      type:
      - "null"
      - "string"
    last_name:
      type:
      - "null"
      - "string"
    email:
      type:
      - "null"
      - "string"
    type:
      type:
      - "null"
      - "integer"
    status:
      type:
      - "null"
      - "string"
    pmi:
      type:
      - "null"
      - "integer"
    timezone:
      type:
      - "null"
      - "string"
    dept:
      type:
      - "null"
      - "string"
    created_at:
      format: "date-time"
      type:
      - "null"
      - "string"
    last_login_time:
      format: "date-time"
      type:
      - "null"
      - "string"
    last_client_version:
      type:
      - "null"
      - "string"
    group_ids:
      items:
        type:
        - "string"
      type:
      - "null"
      - "array"
    im_group_ids:
      items:
        type:
        - "string"
      type:
      - "null"
      - "array"
    verified:
      type:
      - "null"
      - "integer"
  type: "object"
  additionalProperties: false
supported_sync_modes:
- "full_refresh"
source_defined_cursor: false
default_cursor_field: []
source_defined_primary_key: []
sync_mode: "full_refresh"
cursor_field: []
destination_sync_mode: "append"
primary_key: []