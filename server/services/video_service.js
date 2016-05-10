'use strict';

exports.findVideos = function*(query) {
  return yield models.Video.findAll(query);
}

exports.findVideoById = function*(id, query) {
  return yield models.Video.findById(id, query);
}