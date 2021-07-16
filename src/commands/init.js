const { execSync } = require('child_process');

const provisionFolders = () => {
  execSync('mkdir dbt && mkdir config && mkdir src');
}

module.exports = () => {
  provisionFolders();
};
