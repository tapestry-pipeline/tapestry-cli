#!/usr/bin/env node

const { execSync } = require('child_process');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { countSources } = require(`${__dirname}/../../src/airbyte/api/countSources.js`);
const { getInstanceId } = require(`${__dirname}/../../src/aws/getInstanceId.js`);
const {getLogs} = require(`${__dirname}/../../src/airbyte/api/getLogs.js`); 
const app = express();
const host = 'localhost';
const port = 7777;

app.use(cors());

// app.use(express.static(path.resolve(__dirname + '/../app/build/')));

app.get('/api', (_, res) => {
  res.json({message: "Hello from the server!"})
  // res.sendFile(path.resolve(__dirname + '/../app/build/index.html'));
});

app.get('/api/airbyte/getdns', async(req, res) => {
  const dns = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
  const data = { dns }; 
  res.set('Content-Type', 'application/json');
  res.send(data);
}); 

app.get('/api/airbyte/getcards', async(req, res) => {
  const dns = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
  const workspaceId = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/workspace-id"').toString()).Parameter.Value;
  const keyPairName = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/key-pair-name"').toString()).Parameter.Value;
  const instanceId = getInstanceId(keyPairName); 

  const count = await countSources(dns, workspaceId); 
  const instanceData = JSON.parse(execSync(`aws ec2 describe-instance-status --instance-id ${instanceId}`).toString()).InstanceStatuses[0]
  const state = instanceData.InstanceState.Name;
  const instanceStatus = instanceData.InstanceStatus.Details[0].Status
  const systemStatus = instanceData.SystemStatus.Details[0].Status 

  
  const data = [ 
    {name: "Sources", value: count}, 
    {name: "EC2 Instance State", value: state}, 
    {name: "EC2 Instance Reachability", value: instanceStatus}, 
    {name: "System Reachability", value: systemStatus }
  ]
    
  res.set('Content-Type', 'application/json');
  res.send(data);
}); 

app.get('/api/airbyte/cpu', async(req, res) => {
  let date = new Date(); 
  let minusTwelve = new Date(); 
  minusTwelve.setHours(date.getHours() - 12); 
  date = date.toISOString()
  minusTwelve = minusTwelve.toISOString()

  // This might be for all instances? How to get for specific instance? 
  const cpuUtilization = JSON.parse(execSync(`aws cloudwatch get-metric-statistics --metric-name CPUUtilization --start-time ${minusTwelve} --end-time ${date} --period 900 --statistics Average --namespace AWS/EC2`).toString()); 

  res.set('Content-Type', 'application/json');
  res.send();
}); 


app.get('/api/airbyte/getlogs', async(req, res) => {
  const dns = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;

  let data = await getLogs(dns);
  // console.log(data)
  res.set('Content-Type', 'text/plain');
  res.send(data);
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