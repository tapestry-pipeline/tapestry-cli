const { execSync } = require('child_process');

const registerTargets = (keyPairName) => {
  const [TargetGroupArn] = JSON.parse(execSync(`aws elbv2 describe-target-groups --names EC2TargetGroup --query 'TargetGroups[*].TargetGroupArn'`).toString()); 
  const instanceId = getInstanceId(keyPairName);

  execSync(`aws elbv2 register-targets --target-group-arn ${TargetGroupArn} --targets Id=${instanceId},Port=8000`)

  console.log('Waiting for "healthy" status from Target Group...')
  execSync(`aws elbv2 wait target-in-service --target-group-arn ${TargetGroupArn} --targets Id=${instanceId},Port=8000`);
}

module.exports = {
  registerTargets
}