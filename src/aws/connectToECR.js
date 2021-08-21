const { execSync } = require("child_process");
const { yamlWriter } = require("../utils/yamlWriter.js");
const { envWriter } = require("../utils/envWriter.js");
const { getRegion } = require("./getRegion.js");
const { getAccountId } = require("./getAccountId.js");
const log = require('../utils/logger.js').logger;
const chalk = require('chalk');

const connectToECR = (randomString) => {
  const region = getRegion();
  const accountId = getAccountId();

  log('Connecting to ECR...');

  // login
  execSync(`aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin "${accountId}.dkr.ecr.${region}.amazonaws.com"`);

  // switch context to run build command
  execSync(`docker context use default`);

  // build
  log("Building local Grouparoo image... (this will take approximately 3 min)");
  execSync(`docker build -t grouparoo ./grouparoo-config &> .buildLogs`);
  log("Local image build complete!");
  
  // create repo
  execSync(
    `aws ecr create-repository \
    --repository-name grouparoo \
    --image-scanning-configuration scanOnPush=true \
    --region ${region}`
  );

  // tag
  execSync(`docker tag grouparoo:latest ${accountId}.dkr.ecr.${region}.amazonaws.com/grouparoo:latest`);

  // push
  log("Pushing Grouparoo image to ECR... (this will take approximately 4 min)");
  const imageUrl = `${accountId}.dkr.ecr.${region}.amazonaws.com/grouparoo:latest`;
  execSync(`docker push ${imageUrl}`);
  log("Grouparoo image pushed!");

  console.log(`${chalk.bold.cyan(`Please select an "Existing AWS Profile" from the following menu, and hit enter. Then select the "default" AWS Profile and hit enter":`)}`);

  const contextName = `tapestry-ecs-${randomString}`;
  execSync(`aws ssm put-parameter --name "/docker/ecs-context-name" --value "${contextName}" --type String --overwrite`);
  execSync(`docker context create ecs ${contextName}`, { stdio: "inherit" });
  execSync(`docker context use ${contextName}`);

  // writes docker-compose.yml for immediate use
  log('Writing local docker-compose file...');
  yamlWriter(imageUrl);

  log('Writing local .env file...');
  envWriter();

  log('Deploying Grouparoo image on ECS... (this will take approximately 5-10 min)');
  execSync(`docker compose up &> .ecsLogs`);
  log("Grouparoo image deployed on ECS!");

  const grouparooStackName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  execSync(`aws ssm put-parameter --name "/grouparoo/stack-name" --value "${grouparooStackName}" --type String --overwrite`);
};

module.exports = {
  connectToECR
};
