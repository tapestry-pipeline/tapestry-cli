const { execSync } = require('child_process');
const { setupAirbyteSources } = require('../airbyte/api/airbyteSetup.js');
const { buildZoomSource } = require('../airbyte/configObjects/buildZoomSource.js');
const { buildSalesforceSource } = require('../airbyte/configObjects/buildSalesforceSource.js');

const inquirer = require('inquirer');

const validateInput = async (input) => {
  if (input === '') {
    return 'Field required! Must provide input!'
  };
  return true;
}

const sourcesSetup = async () => {
  const publicDNS = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
  const workspaceId = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/workspace-id"').toString()).Parameter.Value;
  
  const syncChoices = [
    'manual', 'Every 30 min', 'Every hour', //TODO - code how to change these intervals
  ];


// const bodyProperties = {
//   "sourceId": "6cfe7dfb-295d-4c24-95f9-89256ba0b309",
//   "destinationId": "4f28af43-438a-425d-bffd-4d9b2c3af372",
//   "operationIds": "cc6e7adc-361e-4c24-b328-6fdb34931b08",
//   "schedule":  {
// 		"units": "30",
// 		"timeUnit": "minutes"
// 	}
// }

  const zoomQuestions = [
    { type: 'list', name: 'zoomSync', message: 'Zoom - Sync Frequency:', choices: syncChoices },
    { type: 'input', name: 'jwtToken', message: 'Zoom - JWT Token:', validate: validateInput },
  ];

  // client_id, client_secret, refresh_token, start_date
  const salesForceQuestions = [
    { type: 'list', name: 'salesforceSync', message: 'Salesforce - Sync Frequency:', choices: syncChoices },
    { type: 'input', name: 'clientId', message: 'Salesforce - Client ID:', validate: validateInput },
    { type: 'input', name: 'clientSecret', message: 'Salesforce - Client Secret:', validate: validateInput },
    { type: 'input', name: 'refreshToken', message: 'Salesforce - Refresh Token:', validate: validateInput },
    { type: 'input', name: 'startDate', message: 'Salesforce - Start Date (i.e. "2021-01-25T00:00:00Z"):', validate: validateInput },//TODO - default current day and time?
  ];

  const questions = zoomQuestions.concat(salesForceQuestions);

  await inquirer
    .prompt(questions)
    .then(async answers => {
      const zoomBody = buildZoomSource(answers.jwtToken, workspaceId);
      const salesforceSourceBody = buildSalesforceSource(
        answers.clientId,
        answers.clientSecret,
        answers.refreshToken,
        answers.startDate,
        workspaceId
      );

      await setupAirbyteSources(publicDNS, [zoomBody, salesforceSourceBody], 'a145746b-42e5-4351-ab65-acf7f7f0a9ea'); // TODO - retrieve Snowflake destination Id after creation
    });
}

module.exports = async () => {
  await sourcesSetup();
  console.log('Airbyte sources configured!');
}
