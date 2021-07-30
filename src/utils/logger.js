const chalk = require('chalk');

const logger = (text) => console.log(`${chalk.bold.green('\u2714')} ${chalk.bold.white(text)}`);

module.exports = {
  logger
}

