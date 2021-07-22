const { execSync } = require('child_process');

const templateFilePath = execSync(`pwd`).toString().trim(); 

module.exports = {
  templateFilePath
}