'use strict';

module.exports = function ( router ) {
  router.get('/', index);
};

function* index() {
  yield this.render('home/index', {
    title: 'VJ'
  });
}