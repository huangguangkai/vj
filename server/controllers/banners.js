'use strict';

const config = require('../../config');

const bannerService = require('../services/banner_service');

module.exports = function ( router ) {
  router.get('/', getBanners);
  router.get('/:id', getBannerById);
  router.put('/:id', putBannerById);
  router.post('/', postBanner);
};

/**
 * 获取广告位
 */
function* getBanners() {
  const condition = this.request.condition;
  const query = this.query;


  const result = yield bannerService.findAndCountBanners({
    where: {delete_status: query.delete_status},
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
 * 获取广告位
 */
function* getBannerById() {
  const id = this.params.id;
  this.body = yield bannerService.findBannerById(id);
}

/**
 * 修改广告位
 */
function* putBannerById() {
  const id = this.params.id;
  const body = this.request.body;

  const result = yield bannerService.updateBanner(body, {
    id: id
  });
  this.body = result;
}

/**
 * 创建广告位
 */
function* postBanner() {
  const body = this.request.body;
  this.body = yield bannerService.createBanner(body);
}