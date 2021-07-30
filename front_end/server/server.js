#!/usr/bin/env node

const { execSync } = require('child_process');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { countSources } = require(`${__dirname}/../../src/airbyte/api/countSources.js`);
const { getInstanceId } = require(`${__dirname}/../../src/aws/getInstanceId.js`);
const app = express();
const host = 'localhost';
const port = 7777;

app.use(cors());

// app.use(express.static(path.resolve(__dirname + '/../app/build/')));

app.get('/api', (_, res) => {
  res.json({message: "Hello from the server!"})
  // res.sendFile(path.resolve(__dirname + '/../app/build/index.html'));
});

// app.get('/api/airbyte', async (req, res) => {
//   
//   const [ [ instanceId ] ] = JSON.parse(execSync(`aws ec2 describe-instances --filters "Name=key-name, Values=${keyPairName}" --query "Reservations[*].Instances[*].InstanceId"`).toString());
//   const region = execSync(`aws configure get region`).toString().trim();
//   const airbyte = { keyPairName, instanceId, region };
//   res.set('Content-Type', 'application/json');
//   res.send(airbyte);
// });

app.get('/api/airbyte/getdns', async(req, res) => {
  const dns = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
  const data = { dns }; 
  res.set('Content-Type', 'application/json');
  res.send(data);
}); 

app.get('/api/airbyte/getcards', async(req, res) => {
  const dns = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
  const workspaceId = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/workspace-id"').toString()).Parameter.Value;
  // const keyPairName = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/key-pair-name"').toString()).Parameter.Value;
  // const instanceId = getInstanceId(keyPairName); 
  const instanceId = 'i-0b1abf75ad0389ca3'; //TODO - make not hard-coded with code above

  const count = await countSources(dns, workspaceId); 
  const instanceData = JSON.parse(execSync(`aws ec2 describe-instance-status --instance-id ${instanceId}`).toString()).InstanceStatuses[0]
  const state = instanceData.InstanceState.Name;
  const instanceStatus = instanceData.InstanceStatus.Details[0].Status
  const systemStatus = instanceData.SystemStatus.Details[0].Status 
  let current = new Date();
  let minusOne = new Date(); 
  minusOne = minusOne.setHours(current.getHours() - 1).toString();
  current = current.toString();

  const cpuUtilization = JSON.parse(execSync(`aws cloudwatch get-metric-statistics --metric-name CPUUtilization --start-time 2021-07-30T21:00:00 --end-time 2021-07-30T21:45:00 --period 120 --statistics Average --namespace AWS/EC2`).toString()); 
   

  const data = [ 
    {name: "Sources", value: count}, 
    {name: "EC2 Instance State", value: state}, 
    {name: "EC2 Instance Reachability", value: instanceStatus}, 
    {name: "System Reachability", value: systemStatus }, 
    {name: "EC2 Instance CPU Utilization", value: cpuUtilization }  
  ]
    
  res.set('Content-Type', 'application/json');
  res.send(data);
}); 

app.get('/api/airbyte/countsources', async(req, res) => {
  
  const data = { dns, workspaceId }; 
  res.set('Content-Type', 'application/json');
  res.send(data);
}); 

app.get('/api/airbyte/cpu', async(req, res) => {
  res.set('Content-Type', 'application/json');
  res.send();
}); 

app.get('/api/airbyte/statuscheck', async(req, res) => {
  res.set('Content-Type', 'application/json');
  res.send();
}); 

app.get('/api/airbyte/getLogs', async(req, res) => {
  // res.set('Content-Type', 'application/json'); ?? 
  res.send();
}); 

// app.get('/traffic', async (req, res) => {
//   const traffic = await getFromTable('TRAFFIC');
//   res.set('Content-Type', 'application/json');
//   res.send(traffic);
// });

// app.get('/endpoints', async (req, res) => {
//   const endpoints = await getFromTable('SERVICES_CONFIG');
//   res.set('Content-Type', 'application/json');
//   res.send(endpoints);
// });

// app.get('/subdomain', (req, res) => {
//   res.set('Content-Type', 'application/json');
//   res.send(
//     JSON.stringify('https://' + process.env.AWS_DOMAIN_NAME + '/service?id=')
//   );
// });

app.listen(port, host, () => {
  console.log(`\nYour Tapestry Dashboard is now available at: http://${host}:${port}.`);
  console.log('Control + C to quit.');
});