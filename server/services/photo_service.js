'use strict';

exports.findPhotoById = function*(id, query) {
  return yield models.Photo.findById(id, query);
}

exports.findPhotos = function*(query) {
  return yield models.Photo.findAll(query);
}

exports.findAndCountPhotos = function*(query) {
  return yield models.Photo.findAndCountAll(query);
}

exports.updatePhoto = function*(body, where) {
  return yield models.Photo.update(body, {
    where: where
  });
}

exports.createPhotos = function*(body) {
  return yield models.Photo.bulkCreate(body);
}

exports.destroyPhoto = function*(id) {
  const photo = yield this.findPhotoById(id);
  return yield photo.destroy();
}