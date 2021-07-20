
const { execSync } = require('child_process');

const getRegion = () => {
  return execSync(`aws configure get region`).toString().trim();
}

const getAccountId = () => {
  return  JSON.parse(execSync(`aws sts get-caller-identity`)).Account;
}

const region = getRegion();
const accountId = getAccountId();

const connectToECR= () => {
    // LOGIN
    execSync(`aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin "${accountId}.dkr.ecr.${region}.amazonaws.com"`, {stdio:'inherit'});
   
    // -t fantasticfour/grouparoo:latest
    // BUILD
    execSync(`docker image build ./my-tapestry-project`);
    
    // // CREATE REPO
    execSync(`aws ecr create-repository \
    --repository-name grouparoo \
    --image-scanning-configuration scanOnPush=true \
    --region ${region}`);

    // // TAG
    execSync(`docker tag grouparoo:latest ${accountId}.dkr.ecr.${region}.amazonaws.com/grouparoo:latest`);

    // // PUSH
    execSync(`docker push ${accountId}.dkr.ecr.${region}.amazonaws.com/grouparoo:latest`) 
}
connectToECR();

// let password = execSync(`aws ecr get-login-password --region ${region}`).toString();