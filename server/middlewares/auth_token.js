'use strict';

const authToken = require('../../libs/auth_token');

/*
 * Middleware to verify the token and store the user data in this.user
 *
 * todo use redis
 *
 */
module.exports = function () {
  return function *( next ) {
    if ( this.user ) {
      return yield next;
    }

    try {
      const token = authToken.parseFromHeaders(this.header);
      this.token  = token;

      const data = yield authToken.getDataByToken(token);

      this.user = data;

    } catch ( err ) {
      this.throw(401);
    }

    yield next;
  };
};
