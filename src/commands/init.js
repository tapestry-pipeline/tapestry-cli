const inquirer = require('inquirer');
const { execSync } = require('child_process');

const validateInput = async (input) => {
  if (input === '') {
    return 'Field required! Must provide input!'
  };
  return true;
}

const questions = [
  { type: 'input', name: 'projectName', message: 'Project name:', default: 'tapestry-project' },
];

const gatherInfo = async () => {
  console.log('Please provide the following details:')
  await inquirer
    .prompt(questions)
    .then(async answers => {
      execSync(`aws ssm put-parameter --name "/project-name" --value "${answers.projectName}" --type String --overwrite`);
    })
    .catch(error => console.log(error));
}

const provisionFolders = async () => {
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  console.log(projectName);
  execSync(`mkdir ${projectName}`);
  execSync(`cd ${projectName} && mkdir airbyte`);
}


module.exports = async () => {
  await gatherInfo();
  await provisionFolders();
}