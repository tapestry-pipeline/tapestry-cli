#!/usr/bin/env node

const program = require('commander');

// const deploy = require('../src/commands/deploy');
const init = require('../src/commands/init');

// program
//   .command('deploy')
//   .alias('d')
//   .description('Deploys Airbyte on system')
//   .action(deploy)

  program
  .command('init')
  .alias('i')
  .description('Provisions project folder/file structure')
  .action(init)

program.parse(process.argv);
