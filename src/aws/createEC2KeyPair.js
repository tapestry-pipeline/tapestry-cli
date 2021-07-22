const { execSync } = require('child_process');

const createEC2KeyPair = (keyPairName) => {
  execSync(`aws ec2 create-key-pair --key-name ${keyPairName} --query "KeyMaterial" --output text > ${keyPairName}.pem`);
  execSync(`aws ssm put-parameter --name "/airbyte/key-pair" --value "$(cat ${keyPairName}.pem)" --type SecureString --overwrite`);
  execSync(`rm "${keyPairName}.pem"`);
  console.log('EC2 Key Pair created \u2714');
}

module.exports = {
  createEC2KeyPair
}