const { execSync } = require('child_process');

const getInstanceId = (keyPairName) => {
  const [ [ instanceId ] ] = JSON.parse(execSync(`aws ec2 describe-instances --filters "Name=key-name, Values=${keyPairName}" --query "Reservations[*].Instances[*].InstanceId"`).toString());
  return instanceId;
}

module.exports = {
  getInstanceId
}
