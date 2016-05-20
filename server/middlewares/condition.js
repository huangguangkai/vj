'use strict';

/**
 * 关键字 order where attributes page count
 */
module.exports = function () {
  return function *( next ) {
    const query     = this.query;
    const condition = {};

    //order
    if ( query.order ) {
      condition.order = query.order;
    }
    //where
    condition.where = query.where || null;

    //attributes
    if ( query.attributes ) {
      condition.attributes = query.attributes.split(',');
    } else {
      condition.attributes = null;
    }

    //pagination
    const page       = Number(query.page) || 1;
    const perpage      = Number(query.perpage) || 20;
    condition.offset = perpage * (page - 1);
    condition.limit  = perpage;

    this.request.condition = condition;
    yield next;
  };
};
