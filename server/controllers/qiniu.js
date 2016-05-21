'use strict';

const qiniu = require('../../libs/qiniu');
const config = require('../../config');

module.exports = function ( router ) {
  router.get('/uptoken', uptoken);
};

function* uptoken() {
  const query = this.query;
  const bucket = query.bucket || config.qiniu.buckets.static.name;
  const uptoken = qiniu.uptoken(bucket);
  this.body = {
    uptoken: uptoken
  };
}