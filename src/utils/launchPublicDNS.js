const chalk = require('chalk');
const open = require('open');

const launchPublicDNS = async (publicDNS) => {
  console.log(`${chalk.cyan(publicDNS)}`);
  await open(publicDNS);
}

module.exports = {
  launchPublicDNS
}