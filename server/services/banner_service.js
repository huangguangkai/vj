'use strict';

exports.findBanners = function*(query) {
  return yield models.Banner.findAll(query);
}