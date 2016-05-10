'use strict';

exports.findHomeRecommends = function*(query) {
  return yield models.HomeRecommend.findAll(query);
}