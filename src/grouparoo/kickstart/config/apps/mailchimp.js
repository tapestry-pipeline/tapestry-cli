
const {mailchimpApiKey,  mailchimpAppId} = require('../../commands.js');
exports.default = async function buildConfig() {
  return [
    {
      class: "app",
      id:  mailchimpAppId,
      name:  mailchimpAppId,
      type: "mailchimp",
      options: {
        apiKey: mailchimpApiKey, // Mailchimp API key
        // {{ssm:MAILCHIMP_API_KEY}}
      },
    },
  ];
};
