const { execSync } = require('child_process');
const { setupAirbyteSources } = require('../airbyte/api-calls.js');
const { buildZoomSource } = require('../airbyte/zoom-source-body.js');
const { buildSalesforceSource } = require('../airbyte/salesforce-source-body.js');

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
    'manual', 'Every 30 min', 'Every hour',
  ];

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
    { type: 'input', name: 'startDate', message: 'Salesforce - Start Date (i.e. "2021-01-25T00:00:00Z"):', validate: validateInput },
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

      await setupAirbyteSources(publicDNS, [zoomBody, salesforceSourceBody], '98769a3f-85d7-44aa-b3dd-7fd2e2add821');
    });
}

module.exports = async () => {
  await sourcesSetup();
  console.log('Airbyte sources configured!');
}
