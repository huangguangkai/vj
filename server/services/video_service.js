'use strict';

exports.findVideos = function*(query) {
  return yield models.Video.findAll(query);
}

exports.findAndCountVideos = function*(query) {
  return yield models.Video.findAndCountAll(query);
}

exports.findVideoById = function*(id, query) {
  return yield models.Video.findById(id, query);
}

exports.updateVideo = function*(body, where) {
  return yield models.Video.update(body, {
    where: where
  });
}