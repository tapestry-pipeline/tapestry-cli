const buildSalesforceSource = (client_id, client_secret, refresh_token, start_date, workspaceId) => {
  return {
    "sourceDefinitionId": "2470e835-feaf-4db6-96f3-70fd645acc77",
    "connectionConfiguration": {
      "client_id": client_id,
      "client_secret": client_secret,
      "refresh_token": refresh_token,
      "start_date": start_date,
      "api_type": "BULK"
    },
  "workspaceId": workspaceId,
  "name": "Salesforce (Tapestry)"
  }
}

module.exports = {
  buildSalesforceSource
}
