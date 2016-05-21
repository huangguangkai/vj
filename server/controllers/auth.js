'use strict';

const authToken = require('../../libs/auth_token');
const config = require('../../config');

module.exports = function ( router ) {
  router.get('/logout', logout);
  router.get('/test', testAuth);
  router.get('/qiniutoken', qiniutoken);
};


function* logout() {
  const userId = this.user.id;

  try {
    const result = yield authToken.expireUserToken(userId, this.token);

    this.body = {
      status: 1,
    };
  } catch ( error ) {
    this.body = {};
  }
}


function* testAuth() {
  this.body = this.user;
}

function* qiniutoken(next) {
  const bucketName = config.qiniu.buckets.static.name;
  const qiniuClient = componentManager.getComponent('qiniu');
  const uptoken = qiniuClient.uploadToken(bucketName);
  this.body = {
    uptoken: uptoken
  };
}