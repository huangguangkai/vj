'use strict';

const path = require('path');

const koa = require('koa');
const responseTime = require('koa-response-time');
const bodyParser = require('koa-bodyparser');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const render = require('koa-swig');
const enrouten = require('siren-enrouten');
const favicon = require('koa-favicon');

const config = require('./config');
const StyleHelper = require('./libs/style_helper');
const middlewares = require('./server/middlewares');

const root = __dirname;

const app = koa();

app.use(responseTime());

if ('development' === app.env) {
  const logger = require('koa-logger');
  app.use(logger());
}

app.use(favicon(root + '/public/favicon.ico'));

app.use(middlewares.staticCache({
  dir: path.join(root, 'public/'),
  maxAge: 30 * 24 * 60 * 60,
  gzip: true,
}));

app.use(middlewares.exception(app));

app.use(bodyParser());

app.use(conditional());
app.use(etag());

app.use(middlewares.lang());

const isDev = 'production' !== app.env;
const cdnPrefix = config.qiniu.buckets.static.prefix;
const staticPrefix = isDev ? '' : cdnPrefix;
const jsPrefix = isDev ? '/src' : (cdnPrefix + '/js');

// render
app.context.render = render({
  root: path.join(root, 'server/views'),
  autoescape: true,
  cache: 'production' === app.env ? 'memory' : false,
  ext: 'html',
  locals: {
    isDev: isDev,
    staticPrefix: staticPrefix,
    cdnPrefix: cdnPrefix,
    jsPrefix: jsPrefix,
    styleHelper: new StyleHelper(isDev, staticPrefix),
    CONSTANTS: global.CONSTANTS
  },
  // writeBody: true,
  //filters: filters,
  //tags: tags,
  //extensions: extensions
});

app.use(middlewares.apiNotFound());
app.use(middlewares.condition());

app.use(enrouten(app, {
  basedir: root,
  index: 'server/routes/index',
  directory: 'server/controllers',
  routes: []
}));

app.on('error', function (err) {
  console.log(chalk.red(err));
});

module.exports = app;
