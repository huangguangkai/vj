'use strict';

exports.findBannerById = function*(id) {
  return yield models.Banner.findById(id);
}

exports.findBanners = function*(query) {
  return yield models.Banner.findAll(query);
}

exports.findAndCountBanners = function*(query) {
  return yield models.Banner.findAndCountAll(query);
}

exports.updateBanner = function*(body, where) {
  body.updated_at = new Date();
  return yield models.Banner.update(body, {
    where: where
  });
}

exports.createBanner = function*(body) {
  return yield models.Banner.create(body);
};