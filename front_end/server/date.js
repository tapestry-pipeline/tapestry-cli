const { execSync } = require('child_process');
const { getInstanceId } = require(`${__dirname}/../../src/aws/getInstanceId.js`);
const keyPairName = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/key-pair-name"').toString()).Parameter.Value;
//  execSync(`aws ec2 monitor-instances --instance-ids ${instanceId}`)
 const instanceId = getInstanceId(keyPairName); 

let date = new Date(); 
let minusTwelve = new Date(); 
minusTwelve.setHours(date.getHours() - 12); 
date = date.toISOString()
minusTwelve = minusTwelve.toISOString()

const cpuUtilization = JSON.parse(execSync(`aws cloudwatch get-metric-statistics --metric-name CPUUtilization --dimensions Name=InstanceId,Value=${instanceId} --start-time ${minusTwelve} --end-time ${date} --period 900 --statistics Average --namespace AWS/EC2`).toString()).Datapoints; 

 console.log(cpuUtilization); 