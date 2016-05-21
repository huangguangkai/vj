'use strict';

exports.findPhotoPackages = function*(query) {
  return yield models.PhotoPackage.findAll(query);
};

exports.findAndCountPhotoPackages = function*(query) {
  return yield models.PhotoPackage.findAndCountAll(query);
};

exports.findPhotoPackageById = function*(id, query) {
  return yield models.PhotoPackage.findById(id, query);
};

exports.updatePhotoPackage = function*(body, where) {
  return yield models.PhotoPackage.update(body, {
    where: where
  });
};

exports.deletePhotoPackage = function*(id) {
  return yield this.updatePhotoPackage({
    delete_status: CONSTANTS.PHOTO_PACKAGE.DELETE_STATUS.DELETED,
  }, {
    id: id
  });
}