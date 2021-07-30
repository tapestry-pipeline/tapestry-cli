const { execSync } = require('child_process');
const log = require('../utils/logger.js').logger;

const createEC2KeyPair = (keyPairName) => {
  execSync(`aws ec2 create-key-pair --key-name ${keyPairName} --query "KeyMaterial" --output text > ${keyPairName}.pem`);
  execSync(`aws ssm put-parameter --name "/airbyte/key-pair-name" --value "${keyPairName}" --type String --overwrite`);
  execSync(`aws ssm put-parameter --name "/airbyte/key-pair-rsa" --value "$(cat ${keyPairName}.pem)" --type SecureString --overwrite`);
  execSync(`rm "${keyPairName}.pem"`);
  log('EC2 Key Pair created');
}

module.exports = {
  createEC2KeyPair
}