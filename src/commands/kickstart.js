const { execSync } = require('child_process');
const { setupAirbyteSources } = require('../airbyte/setupConnections/airbyteSetup.js');
const { buildZoomSource } = require('../airbyte/configObjects/buildZoomSource.js');
const { buildSalesforceSource } = require('../airbyte/configObjects/buildSalesforceSource.js');

const inquirer = require('inquirer');

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

const sourcesSetup = async () => {
  const publicDNS = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
  const workspaceId = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/workspace-id"').toString()).Parameter.Value;
  
  const syncChoices = [
    'manual', 'Every hour', 'Every 6 hours', 
  ];

  const syncQuestion = [
    { type: 'list', name: 'syncChoice', message: 'How often do you want to sync your source data to your warehouse?', choices: syncChoices }
  ]

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
    { type: 'input', name: 'apiKey', message: 'Mailchimp Destination - API Key', validate: validateInput },
    { type: 'input', name: 'listId', message: 'Mailchimp Destination - Audience ID:', validate: validateInput },
  ]; 

  // /mailchimp/apiKey
  // /mailchimp/listId

  // await inquirer
  // .prompt(questions)
  // .then(async answers => {
    
  //   execSync(`aws ssm put-parameter --name "/snowflake/acct-username" --value "${answers.snowUsername}" --type SecureString --overwrite`);
  //   execSync(`aws ssm put-parameter --name "/snowflake/acct-pass" --value "${answers.snowAcctPass}" --type SecureString --overwrite`);
  //   execSync(`aws ssm put-parameter --name "/snowflake/ab-user-pass" --value "${answers.snowAbUserPass}" --type SecureString --overwrite`);
  // })
  // .catch(error => console.log(error));

  const questions = zoomQuestions.concat(salesForceQuestions, syncQuestion, mailchimpQuestions);

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
      

      execSync(`aws ssm put-parameter --name "/mailchimp/apiKey" --value "${answers.apiKey}" --type SecureString --overwrite`);
      execSync(`aws ssm put-parameter --name "/mailchimp/listId" --value "${answers.listId}" --type SecureString --overwrite`);

      const syncObj = buildSyncScheduleObj(answers.syncChoice);
      
      const destinationId = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/snowflake-destination-id"').toString()).Parameter.Value;
      await setupAirbyteSources(publicDNS, [zoomBody, salesforceSourceBody], destinationId, syncObj); 
    });
}

module.exports = async () => {
  await sourcesSetup();
  console.log('Airbyte sources configured!');
}
