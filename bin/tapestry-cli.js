#!/usr/bin/env node

const { program } = require('commander');

// command imports
const deploy = require('../src/commands/deploy');
const init = require('../src/commands/init');
const kickstart = require('../src/commands/kickstart');

program
  .command('deploy')
  .alias('d')
  .description('Deploys Airbyte on system')
  .action(deploy)

program
  .command('kickstart')
  .alias('k')
  .description('Sets up third-party SaaS services in pipeline for immediate use')
  .action(kickstart)

program
  .command('init')
  .alias('i')
  .description('Gather preliminary information')
  .action(init)

program.parse(process.argv);

