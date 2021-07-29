const { execSync } = require("child_process");
const { yamlWriter } = require("../utils/yamlWriter.js");
const { envWriter } = require("../utils/envWriter.js");
const { getRegion } = require("./getRegion.js");
const { getAccountId } = require("./getAccountId.js");


const connectToECR = (randomString) => {
  const region = getRegion();
  const accountId = getAccountId();
  // LOGIN
  execSync(
    `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin "${accountId}.dkr.ecr.${region}.amazonaws.com"`,
    { stdio: "inherit" }
  );

  // switch context to run build command
  execSync(`docker context use default`);
  // BUILD
  execSync(`docker build -t grouparoo ./grouparoo-config`, { stdio: "inherit" });

  // CREATE REPO
  execSync(
    `aws ecr create-repository \
    --repository-name grouparoo \
    --image-scanning-configuration scanOnPush=true \
    --region ${region}`
  );

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

  console.log(
    `Please select an "Existing AWS Profile" from the following menu, and hit enter. Then select the "default" AWS Profile and hit enter"`
  );
  execSync(`docker context create ecs tapestryecs`, { stdio: "inherit" });
  execSync(`docker context use tapestryecs`);

  // yamlWriter(imageUrl);
  // writes docker-compose.yml for immediate use
  yamlWriter(imageUrl);
  envWriter();
  execSync(`docker compose up`, { stdio: "inherit" });

  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  // TODO - currently stores projectName as grouparoo stack name -> maybe we can rename it to make it more consistent with the other stack name's format?
  execSync(`aws ssm put-parameter --name "/grouparoo/stack-name" --value "${projectName}" --type String --overwrite`);
  //
};

module.exports = {
  connectToECR
};
