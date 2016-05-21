'use strict';

const config = require('../../config');

const photoService = require('../services/photo_service');
const photoCategoryService = require('../services/photo_category_service');
const photoPackageService = require('../services/photo_package_service');

module.exports = function ( router ) {
  router.get('/', list);

  // router.get('/:id', getPhotoById);
  router.put('/:id', putPhotoById);
  router.delete('/:id', deletePhotoById);
  router.post('/', postPhoto);

  router.get('/categories', categories);
  router.get('/categories/:id', getCategoryById);
  router.put('/categories/:id', putCategoryById);

  router.get('/packages', packages);
  router.get('/packages/:id', getPackageById);
  router.put('/packages/:id', putPackageById);
  // router.delete('/packages/:id', deletePackageById);
};

/**
 * 获取照片列表
 */
function* list() {
  const query = this.query;
  const condition = this.request.condition;

  const result = yield photoService.findAndCountPhotos({
    order: [['updated_at', 'DESC']],
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

/**
 * 获取分类
 */
function* getCategoryById() {
  const id = this.params.id;
  this.body = yield photoCategoryService.findPhotoCategoryById(id);
}

/**
 * 修改分类
 */
function* putCategoryById() {
  const id = this.params.id;
  const body = this.request.body;

  this.body = yield photoCategoryService.updatePhotoCategory(body, {
    id: id
  });
}

/**
 * 获取照片套餐列表
 */
function* packages() {
  const query = this.query;
  const condition = this.request.condition;

  const result = yield photoPackageService.findAndCountPhotoPackages({
    where: {
      delete_status: query.delete_status
    },
    order: [['updated_at', 'DESC']],
    offset: condition.offset,
    limit: condition.limit,
    raw: true
  });

  this.body = {
    count: result.count,
    data: result.rows
  };
}

/**
 * 获取套餐
 */
function* getPackageById() {
  const id = this.params.id;
  this.body = yield photoPackageService.findPhotoPackageById(id);
}

/**
 * 修改套餐
 */
function* putPackageById() {
  const id = this.params.id;
  const body = this.request.body;
  this.body = yield photoPackageService.updatePhotoPackage(body, {
    id: id
  });
}

/**
 * 删除套餐
 */
function* deletePackageById() {
  const id = this.params.id;
  const result = yield photoPackageService.deletePhotoPackage(id);
  this.body = {status: 1};
}