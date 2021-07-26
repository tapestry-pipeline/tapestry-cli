const { execSync } = require('child_process');

const storePublicDNS = (projectName) => {
  const [ publicDNS ] = JSON.parse(execSync(`aws cloudformation describe-stacks --stack-name ${projectName}-airbyte --query "Stacks[0].Outputs[?OutputKey=='PublicDNS'].OutputValue"`));
  execSync(`aws ssm put-parameter --name "/airbyte/public-dns" --value "http://${publicDNS}" --type String --overwrite`);
}

module.exports = {
  storePublicDNS
}