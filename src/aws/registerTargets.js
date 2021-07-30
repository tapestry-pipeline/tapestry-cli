const { execSync } = require('child_process');
const { getInstanceId } = require('./getInstanceId.js');
const log = require('../utils/logger.js').logger;

const registerTargets = (keyPairName) => {
  const [TargetGroupArn] = JSON.parse(execSync(`aws elbv2 describe-target-groups --names EC2TargetGroup --query 'TargetGroups[*].TargetGroupArn'`).toString()); 
  const instanceId = getInstanceId(keyPairName);

  execSync(`aws elbv2 register-targets --target-group-arn ${TargetGroupArn} --targets Id=${instanceId},Port=8000`)

  log('Waiting for "healthy" status from Target Group... (this will take approximately 30 sec)');
  execSync(`aws elbv2 wait target-in-service --target-group-arn ${TargetGroupArn} --targets Id=${instanceId},Port=8000`);
}

module.exports = {
  registerTargets
}