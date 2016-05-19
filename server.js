'use strict';

const chalk = require('chalk');
const Redis = require('ioredis');

const app = require('./app');
const config = require('./config');

global.models = require('./server/models');
global.CONSTANTS = require('./constants');
global.redisClient = new Redis(config.redis);

redisClient.on('error', err => {
  console.error(err.stack);
  this.emit('error', err);
});

app.listen(config.port, () => {
  console.log(chalk.blue('server listening on port', config.port, 'success'));
});