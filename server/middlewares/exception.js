'use strict';

module.exports = function ( app ) {
  return function* ( next ) {
    try {
      yield* next;
    } catch ( err ) {

       if ( err.status === 401 ) {
        this.status = 401;
        this.body   = '用户未登陆';
        return;
      }

      this.status = err.status || 500;
      this.body   = err;
    }
  };
};
