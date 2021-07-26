#!/usr/bin/env node

const { program } = require('commander');

// command imports
const deploy = require('../src/commands/deploy');
const init = require('../src/commands/init');
const kickstart = require('../src/commands/kickstart');
const teardown = require('../src/commands/teardown');

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
  .description('Gather preliminary information and create file structure')
  .action(init)

program
  .command('teardown')
  .alias('t')
  .description('Tear down all AWS resources associated with project')
  .action(teardown)

program.parse(process.argv);

