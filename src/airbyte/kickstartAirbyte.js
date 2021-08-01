const inquirer = require('inquirer');
const { execSync } = require("child_process");
const { deployAirbyte } = require("./deployAirbyte.js");
const { setupAirbyteSources } = require('./setupConnections/airbyteSetup.js');
const { buildZoomSource } = require('./configObjects/buildZoomSource.js');
const { buildSalesforceSource } = require('./configObjects/buildSalesforceSource.js');

const validateInput = async (input) => {
  if (input === '') {
    return 'Field required! Must provide input!'
  };
  return true;
}

const buildSyncScheduleObj = (syncChoice) => {
  let units = null;

  switch (syncChoice) {
    case 'Every hour':
      units = '1';
      break;
    case 'Every 6 hours':
      units = '6';
      break;
  }

  if (units) {
    return {
      "units": units,
      "timeUnit": "hours"
    }
  } else {
    return null;
  }
}

const kickstartAirbyte = async (projectName, randomString) => {
  const syncChoices = [
    'manual', 'Every hour', 'Every 6 hours', 
  ];

  const syncQuestion = [
    { type: 'list', name: 'syncChoice', message: 'How often do you want to sync your source data to your warehouse?', choices: syncChoices }
  ];

  const zoomQuestions = [
    { type: 'input', name: 'jwtToken', message: 'Zoom Source - JWT Token:', validate: validateInput },
  ];

  const salesForceQuestions = [
    { type: 'input', name: 'clientId', message: 'Salesforce Source - Client ID:', validate: validateInput },
    { type: 'input', name: 'clientSecret', message: 'Salesforce Source - Client Secret:', validate: validateInput },
    { type: 'input', name: 'refreshToken', message: 'Salesforce Source - Refresh Token:', validate: validateInput },
    { type: 'input', name: 'startDate', message: 'Salesforce Source - Start Date (e.g., "2021-01-25T00:00:00Z"):', validate: validateInput },//TODO - default current day and time?
  ];

  const mailchimpQuestions = [
    { type: 'input', name: 'apiKey', message: 'Mailchimp Destination - API Key:', validate: validateInput },
    { type: 'input', name: 'listId', message: 'Mailchimp Destination - Audience ID:', validate: validateInput },
  ]; 

  const questions = zoomQuestions.concat(salesForceQuestions, syncQuestion, mailchimpQuestions);
  
  await inquirer
    .prompt(questions)
    .then(async answers => {
      await deployAirbyte(projectName, randomString);
      
      const workspaceId = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/workspace-id"').toString()).Parameter.Value;
      const publicDNS = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
      
      const zoomBody = buildZoomSource(answers.jwtToken, workspaceId);
      const salesforceSourceBody = buildSalesforceSource(
        answers.clientId,
        answers.clientSecret,
        answers.refreshToken,
        answers.startDate,
        workspaceId
      );
      
      execSync(`aws ssm put-parameter --name "/mailchimp/apiKey" --value "${answers.apiKey}" --type SecureString --overwrite`);
      execSync(`aws ssm put-parameter --name "/mailchimp/listId" --value "${answers.listId}" --type SecureString --overwrite`);

      const syncObj = buildSyncScheduleObj(answers.syncChoice);
      const destinationId = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/snowflake-destination-id"').toString()).Parameter.Value;
      
      await setupAirbyteSources(publicDNS, [zoomBody, salesforceSourceBody], destinationId, syncObj, workspaceId);
    })
    .catch(error => console.log(error));
}

module.exports = {
  kickstartAirbyte
}