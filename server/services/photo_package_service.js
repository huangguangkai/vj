'use strict';

exports.findPhotoPackages = function*(query) {
  return yield models.PhotoPackage.findAll(query);
};

exports.findPhotoPackageById = function*(id, query) {
  return yield models.PhotoPackage.findById(id, query);
};