localhost:8000/api/v1/sources/create

let salesforceSourceBody = {
  "sourceDefinitionId": "2470e835-feaf-4db6-96f3-70fd645acc77",
  "connectionConfiguration": {
      "client_id": "3MVG9cHH2bfKACZZvAmDadHirVluz4QHRbce27tMRDMCY773C5oPhXMqouWafAGXaYVvE6tJqejSgtJUEjFxb",
      "client_secret": "D23B612B1B64884B4D3E14FFDFF3C31F65BE1EC7A60FD3FC66E00FDB1A45D524",
      "refresh_token": "5Aep861ZBValxWWBUeWA.flkR1MwYzh0T_.NXwXCG0WnCdwq07WX54sHyvTOzQa_bgrLG.6R.dMpbIkaoMu5e.H",
      "start_date": "2021-01-25T00:00:00Z",
      "api_type": "BULK"
  },
  "workspaceId": "5ae6b09b-fdec-41af-aaf7-7d94cfc33ef6",
  "name": "Katherine Salesforce"
}

export default salesforceSourceBody;

// localhost:8000/api/v1/sources/check_connection


// {
//   "sourceId": "2714f42d-82e4-4036-a4b0-475ba084fa2f"
// }

