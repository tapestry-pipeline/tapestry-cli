const { execSync, exec } = require("child_process");
const inquirer = require('inquirer');
const { getRegion } = require("../aws/getRegion.js");
const { getAccountId } = require("../aws/getAccountId.js");
const { yamlWriter } = require("../utils/yamlWriter.js");

const launchConfig = () => {
  exec('cd grouparoo-config && grouparoo config');
}

const terminateConfig = () => {
  execSync('kill $(lsof -t -i:3000)');
}

const runRebuild = () => {
  const region = getRegion();
  const accountId = getAccountId();
    
  execSync(
    `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin "${accountId}.dkr.ecr.${region}.amazonaws.com"`,
    { stdio: "inherit" }
  );

  execSync(`docker context use default`);
  // BUILD
  execSync(`docker build -t grouparoo ./grouparoo-config`, { stdio: "inherit" });

   // TAG
  execSync(
    `docker tag grouparoo:latest ${accountId}.dkr.ecr.${region}.amazonaws.com/grouparoo:latest`,
    { stdio: "inherit" }
  );

  // PUSH
  const imageUrl = `${accountId}.dkr.ecr.${region}.amazonaws.com/grouparoo:latest`;
  execSync(
    `docker push ${imageUrl}`,
    { stdio: "inherit" }
  );
  console.log("pushing");
  yamlWriter(imageUrl);

  execSync(`docker context use tapestryecs`);
  execSync(`docker compose up`, { stdio: "inherit" });
  
  const grouparooStackName = JSON.parse(execSync('aws ssm get-parameter --name "/grouparoo/stack-name"').toString()).Parameter.Value;
  execSync(`aws cloudformation wait stack-update-complete --stack-name "${grouparooStackName}"`);
}

const reconfigure = async () => {
  const configConfirmation = [
    {type: 'confirm', name: 'confirmConfig', message: 'In a few moments your Grouparoo configuration will open in your browser.\nPlease make your desired changes and confirm here when you are ready.'}
  ];

  await inquirer
    .prompt(configConfirmation)
    .then(({ confirmConfig }) => {
      if (confirmConfig) {
        runRebuild();
      }
    })
    .catch(error => console.log(error));
}

const rebuild = async () => {
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  const pathConfirmation = [{type: 'confirm', name: 'confirmPath', message: `Go to your Tapestry project's root folder, called ${projectName} for deployment to begin. Confirm when you are ready.`}];

  await inquirer
    .prompt(pathConfirmation)
    .then(async ({ confirmPath }) => {
      if (confirmPath) {
        launchConfig();
        await reconfigure();
        terminateConfig();
      }
    })
    .catch(error => console.log(error));
}

module.exports = async () => {
  console.log('rebuild process initiated...');
  await rebuild();
  console.log('Rebuild complete!');
}