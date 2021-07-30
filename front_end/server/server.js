#!/usr/bin/env node

const { execSync } = require('child_process');
const express = require('express');
const cors = require('cors');
const path = require('path');


const app = express();
const host = 'localhost';
const port = 7777;

app.use(cors());

// app.use(express.static(path.resolve(__dirname + '/../app/build/')));

app.get('/api', (_, res) => {
  res.json({message: "Hello from the server!"})
  // res.sendFile(path.resolve(__dirname + '/../app/build/index.html'));
});

app.get('/api/airbyte', async (req, res) => {
  const airbyteDNS = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/public-dns"').toString()).Parameter.Value;
  const keyPairName = JSON.parse(execSync('aws ssm get-parameter --name "/airbyte/key-pair-name"').toString()).Parameter.Value;
  const [ [ instanceId ] ] = JSON.parse(execSync(`aws ec2 describe-instances --filters "Name=key-name, Values=${keyPairName}" --query "Reservations[*].Instances[*].InstanceId"`).toString());
  const region = execSync(`aws configure get region`).toString().trim();
  const airbyte = { airbyteDNS, keyPairName, instanceId, region };
  res.set('Content-Type', 'application/json');
  res.send(airbyte);
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