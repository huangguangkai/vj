'use strict';

const path = require('path');

const koa = require('koa');
const enrouten = require('siren-enrouten');

const config = require('./config');

const root = __dirname;

const app = koa();

app.use(enrouten(app, {
  basedir: root,
  directory: 'server/controllers'
}));

app.on('error', function (err) {
  console.error(err);
});

module.exports = app;
