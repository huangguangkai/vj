'use strict';

module.exports = function () {

  return function* apiNotFound( next ) {
    yield* next;
    if ( this.status && this.status !== 404 ) {
      return;
    }
    if ( this.body ) {
      return;
    }

    yield this.render('404');
  };
};


