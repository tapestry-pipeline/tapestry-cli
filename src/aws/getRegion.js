const { execSync } = require("child_process");

const getRegion = () => {
  return execSync(`aws configure get region`).toString().trim();
};

module.exports = {
  getRegion
}