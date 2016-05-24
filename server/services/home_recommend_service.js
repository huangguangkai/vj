'use strict';

exports.findHomeRecommendById = function*(id) {
  return yield models.HomeRecommend.findById(id);
}

exports.findHomeRecommends = function*(query) {
  return yield models.HomeRecommend.findAll(query);
}

exports.findAndCountHomeRecommends = function*(query) {
  return yield models.HomeRecommend.findAndCountAll(query);
}

exports.updateHomeRecommend = function*(body, where) {
  body.updated_at = new Date();
  return yield models.HomeRecommend.update(body, {
    where: where
  });
}

exports.createHomeRecommend = function*(body) {
  return yield models.HomeRecommend.create(body);
};