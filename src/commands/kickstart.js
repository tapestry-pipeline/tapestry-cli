const { execSync } = require('child_process');
const { setupAirbyteSources, getWorkspaceId } = require('../airbyte/api-calls.js');
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
  // grab publicDNS
  const publicDNS = 'http://tapes-airby-1a5s5wxcanrwn-2058759617.us-east-2.elb.amazonaws.com/';

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
      // grab workspaceId
      const workspaceId = await getWorkspaceId(publicDNS);
      
      const zoomBody = buildZoomSource(answers.jwtToken, workspaceId);
      const salesforceSourceBody = buildSalesforceSource(
        answers.clientId,
        answers.clientSecret,
        answers.refreshToken,
        answers.startDate,
        workspaceId
      );

      await setupAirbyteSources(publicDNS, [zoomBody, salesforceSourceBody], 'accadcf6-426c-4e71-b568-e5b65a2ffa28');
    })
}

module.exports = async () => {
  await sourcesSetup();
  console.log('Airbyte sources configured!');
}
