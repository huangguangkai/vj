'use strict';

const config = require('../../config');

const photoService = require('../services/photo_service');

module.exports = function ( router ) {
  router.put('/:id/photos', putPhotosByPid);
};

/**
 * 根据套餐ID批量修改照片
 */
function* putPhotosByPid() {
  const id = this.params.id;
  const body = this.request.body;

  this.body = yield photoService.updatePhoto(body, {
    package_id: id
  });
}
