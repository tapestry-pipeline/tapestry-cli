const { execSync } = require('child_process');
// const { getInstanceId } = require(`${__dirname}/../../src/aws/getInstanceId.js`);
// const keyPairName = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/key-pair-name"').toString()).Parameter.Value;
//   const instanceId = getInstanceId(keyPairName); 
 //execSync(`aws ec2 monitor-instances --instance-ids ${instanceId}`)

let date = new Date(); 
let minusOne = new Date(); 
minusOne.setHours(date.getHours() - 1); 
console.log(minusOne); 

date = date.toISOString()
minusOne = minusOne.toISOString()



const cpuUtilization = JSON.parse(execSync(`aws cloudwatch get-metric-statistics --metric-name CPUUtilization --start-time ${minusOne} --end-time ${date} --period 900 --statistics Average --namespace AWS/EC2`).toString()); 
console.log(cpuUtilization)