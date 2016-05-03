'use strict';

const chalk = require('chalk');

const app = require('./app');
const config = require('./config');

global.models = require('./server/models');

app.listen(config.port, () => {
  console.log(chalk.blue('server listening on port', config.port, 'success'));
});