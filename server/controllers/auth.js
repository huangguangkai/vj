'use strict';

const authToken = require('../../libs/auth_token');

module.exports = function ( router ) {
  router.get('/logout', logout);
  router.get('/test', testAuth);
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
