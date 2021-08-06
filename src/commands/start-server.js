const { exec } = require('child_process');
const open = require('open');

module.exports = async () => {
  const server = exec('start_server');
  server.stdout.on('data', (data) => {
    console.log(`${data}`);
    (async () => await open('http://localhost:7777'))();
  });
}
