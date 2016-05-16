'use strict';
const config = require('../../../config');

module.exports = function ( router ) {
  router.get('/', index);
};

function* index() {
  yield this.render('admin/index', {
    title: 'VJ管理后台',
  });
}
