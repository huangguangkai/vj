'use strict';

exports.findPhotos = function*(query) {
  return yield models.Photo.findAll(query);
}