const { execSync } = require("child_process");
const { yamlWriter } = require("../utils/yamlWriter.js");
const { envWriter } = require("../utils/envWriter.js");


const getRegion = () => {
  return execSync(`aws configure get region`).toString().trim();
};

const getAccountId = () => {
  return JSON.parse(execSync(`aws sts get-caller-identity`)).Account;
};

const connectToECR = (repoName, randomString) => {
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
  execSync(`docker build -t grouparoo ./${repoName}`, { stdio: "inherit" });

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
  execSync(
    `docker push ${accountId}.dkr.ecr.${region}.amazonaws.com/grouparoo:latest`,
    { stdio: "inherit" }
  );
  console.log("pushing");

  console.log(
    `Please select an "Existing AWS Profile" from the following menu, and hit enter. Then select the "default" AWS Profile and hit enter"`
  );
  execSync(`docker context create ecs myecscontext_${randomString}`, { stdio: "inherit" });
  execSync(`docker context use myecscontext_${randomString}`);
  const imageUrl = `${accountId}.dkr.ecr.${region}.amazonaws.com/grouparoo:latest`;

  // writes docker-compose.yml for immediate use
  yamlWriter(imageUrl);
  envWriter(repoName);
  execSync(`docker compose up`, { stdio: "inherit" });

  //
};
// connectToECR();

module.exports = {
  connectToECR,
};
