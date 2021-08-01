#!/usr/bin/env node

const { execSync } = require('child_process');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { countSources } = require(`${__dirname}/../../src/airbyte/api/countSources.js`);
const { getInstanceId } = require(`${__dirname}/../../src/aws/getInstanceId.js`);
const { getAirbyteLogs } = require(`${__dirname}/../../src/airbyte/api/getAirbyteLogs.js`); 
const app = express();
const host = 'localhost';
const port = 7777;

app.use(cors());
app.use(express.text({ type: "text/plain" }));

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
  let minusSix = new Date(); 
  minusSix.setHours(date.getHours() - 6); 
  date = date.toISOString()
  minusSix = minusSix.toISOString()

  const keyPairName = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/key-pair-name"').toString()).Parameter.Value;
  const instanceId = getInstanceId(keyPairName); 
  const cpuUtilization = JSON.parse(execSync(`aws cloudwatch get-metric-statistics --metric-name CPUUtilization --dimensions Name=InstanceId,Value=${instanceId} --start-time ${minusSix} --end-time ${date} --period 900 --statistics Average --namespace AWS/EC2`).toString()).Datapoints; 
  
  res.set('Content-Type', 'application/json');
  res.send(cpuUtilization);
}); 

app.get('/api/airbyte/getlogs', async(req, res) => {
  const dns = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;

  let data = await getAirbyteLogs(dns);
  res.set('Content-Type', 'text/plain');
  res.send(data);
});

app.get('/api/grouparoo/getdns', async(req, res) => {
  const projectName = JSON.parse(execSync('aws ssm get-parameter --name "/project-name"').toString()).Parameter.Value;
  const arn = JSON.parse(execSync(`aws cloudformation describe-stack-resources --stack-name ${projectName} --logical-resource-id LoadBalancer --query "StackResources[0].PhysicalResourceId"`));
  const dns = JSON.parse(execSync(`aws elbv2 describe-load-balancers --load-balancer-arns ${arn} --query "LoadBalancers[0].DNSName"`));
  const data = { dns };
  res.set('Content-Type', 'application/json');
  res.send(data);
});

app.listen(port, host, () => {
  console.log(`\nYour Tapestry Dashboard is now available at: http://${host}:${port}.`);
  console.log('Control + C to quit.');
});