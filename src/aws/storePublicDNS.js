const { execSync } = require('child_process');

const storeAirbytePublicDNS = (projectName) => {
  const [ publicDNS ] = JSON.parse(execSync(`aws cloudformation describe-stacks --stack-name ${projectName}-airbyte --query "Stacks[0].Outputs[?OutputKey=='PublicDNS'].OutputValue"`));
  execSync(`aws ssm put-parameter --name "/airbyte/public-dns" --value "http://${publicDNS}" --type String --overwrite`);
}

const storeGrouparooPublicDNS = (projectName) => {
  const arn = JSON.parse(execSync(`aws cloudformation describe-stack-resources --stack-name ${projectName} --logical-resource-id LoadBalancer --query "StackResources[0].PhysicalResourceId"`));
  const dns = JSON.parse(execSync(`aws elbv2 describe-load-balancers --load-balancer-arns ${arn} --query "LoadBalancers[0].DNSName"`));
  execSync(`aws ssm put-parameter --name "/grouparoo/public-dns" --value "http://${dns}:3000" --type String --overwrite`);
}

module.exports = {
  storeAirbytePublicDNS,
  storeGrouparooPublicDNS
}