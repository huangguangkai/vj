'use strict';

exports.findPhotoCategoryById = function*(id, query) {
  return yield models.PhotoCategory.findById(id, query);
};

exports.updatePhotoCategory = function*(body, where) {
  return yield models.PhotoCategory.update(body, {
    where: where
  });
};

exports.findPhotoCategories = function*(query) {
  return yield models.PhotoCategory.findAll(query);
};
