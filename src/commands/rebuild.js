const { execSync } = require("child_process");
const { getRegion } = require("./aws/getRegion.js");
const { getAccountId } = require("./aws/getAccountId.js");

const rebuild = () => {
    const region = getRegion();
    const accountId = getAccountId();
    
  execSync(
    `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin "${accountId}.dkr.ecr.${region}.amazonaws.com"`,
    { stdio: "inherit" }
  );

  execSync(`docker context use default`);
  // BUILD
  execSync(`docker build -t grouparoo ./${directoryName}`, { stdio: "inherit" });

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
  
}

module.exports = () => {
  console.log('rebuild process initiated...');
  rebuild();
  console.log('Rebuild complete!');
}