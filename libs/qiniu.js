const qiniu = require('qiniu');
const config = require('../config');

qiniu.conf.ACCESS_KEY = config.qiniu.keys.access_key;
qiniu.conf.SECRET_KEY = config.qiniu.keys.secret_key;

module.exports = {
  uptoken(bucket) {
    const putPolicy = new qiniu.rs.PutPolicy(bucket);
    return putPolicy.token();
  }
};