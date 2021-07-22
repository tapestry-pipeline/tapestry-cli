const { execSync } = require('child_process');

const launchPublicDNS = (publicDNS) => {
  console.log(publicDNS);
  execSync(`open ${publicDNS}`); //TODO - just for Mac
}

module.exports = {
  launchPublicDNS
}