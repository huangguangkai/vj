'use strict';

const config = require('../../config');

const photoService = require('../services/photo_service');
const photoCategoryService = require('../services/photo_category_service');

module.exports = function ( router ) {
  router.get('/', list);

  // router.get('/:id', getPhotoById);
  router.put('/:id', putPhotoById);
  router.delete('/:id', deletePhotoById);
  router.post('/', postPhoto);

  router.get('/categories', categories);
};

/**
 * 获取照片列表
 */
function* list() {
  const query = this.query;
  const condition = this.request.condition;

  const result = yield photoService.findAndCountPhotos({
    order: [['created_at', 'DESC']],
    offset: condition.offset,
    limit: condition.limit,
    raw: true
  });

  this.body = {
    data: result.rows,
    count: result.count
  };
}

/**
 * 上传照片
 */
function* postPhoto() {
  const photos = this.request.body.photos;

  const body = photos.map(function (photo) {
    return {
      cover_url: `${config.qiniu.buckets.static.prefix}/${photo.key}`
    }
  });
  const result = yield photoService.createPhotos(body);
  this.body = result;
}

/**
 * 修改照片
 */
function* putPhotoById() {
  const id = this.params.id;
  const body = this.request.body;

  const result = yield photoService.updatePhoto(body, {
    id: id
  });
  this.body = result;
}

/**
 * 删除照片
 */
function* deletePhotoById() {
  const id = this.params.id;

  const result = yield photoService.destroyPhoto(id);
  this.body = {status: 1};
}

/**
 * 获取照片分类套餐列表
 */
function* categories() {
  const withPkg = this.query.with_pkg || 0;
  const query = {};

  if (Number(withPkg)){
    query.include = [
      {
        model: models.PhotoPackage,
        as: 'packages'
      }
    ];
  }

  this.body = yield photoCategoryService.findPhotoCategories(query);

}
