const { execSync } = require('child_process');

const getAccountId = () => {
  return JSON.parse(execSync(`aws sts get-caller-identity`)).Account;
};

module.exports = {
  getAccountId
}