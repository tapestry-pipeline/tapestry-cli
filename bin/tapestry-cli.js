#!/usr/bin/env node

const { program } = require('commander');

const deploy = require('../src/commands/deploy');
const init = require('../src/commands/init');
const kickstart = require('../src/commands/kickstart');
const teardown = require('../src/commands/teardown');
const rebuild = require('../src/commands/rebuild');
const startServer = require('../src/commands/start-server');

program
  .command('deploy')
  .alias('d')
  .description('Deploys Airbyte on system')
  .action(deploy)

program
  .command('kickstart')
  .alias('k')
  .description('sets up third-party SaaS services in pipeline for immediate use')
  .action(kickstart)

program
  .command('init')
  .alias('i')
  .description('gather preliminary information and create file structure')
  .action(init)

program
  .command('teardown')
  .alias('t')
  .description('tear down all AWS resources associated with project')
  .action(teardown)

program
  .command("rebuild")
  .alias("r")
  .description("rebuild grouparoo image and push it to AWS Elastic Container Repository")
  .action(rebuild)

program
  .command("start-server")
  .alias("st")
  .description("launch server for Tapestry UI")
  .action(startServer)

program.parse(process.argv);
