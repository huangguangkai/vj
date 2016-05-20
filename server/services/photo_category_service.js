'use strict';

exports.findPhotoCategoryById = function*(id, query) {
  return yield models.PhotoCategory.findById(id, query);
};

exports.findPhotoCategories = function*(query) {
  return yield models.PhotoCategory.findAll(query);
};