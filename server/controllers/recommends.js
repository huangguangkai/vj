'use strict';

const config = require('../../config');

const homeRecommendService = require('../services/home_recommend_service');

module.exports = function ( router ) {
  router.get('/home', getHomeRecommends);
  router.get('/home/:id', getHomeRecommendById);
  router.put('/home/:id', putHomeRecommendById);
  router.post('/home', postHomeRecommend);
};

/**
 * 获取首页推荐
 */
function* getHomeRecommends() {
  const condition = this.request.condition;
  const query = this.query;


  const result = yield homeRecommendService.findAndCountHomeRecommends({
    where: {delete_status: query.delete_status},
    order: [
      ['index', 'DESC'],
      ['updated_at', 'DESC']
    ],
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
 * 获取推荐
 */
function* getHomeRecommendById() {
  const id = this.params.id;
  this.body = yield homeRecommendService.findHomeRecommendById(id);
}

/**
 * 修改推荐
 */
function* putHomeRecommendById() {
  const id = this.params.id;
  const body = this.request.body;

  const result = yield homeRecommendService.updateHomeRecommend(body, {
    id: id
  });
  this.body = result;
}

/**
 * 创建推荐
 */
function* postHomeRecommend() {
  const body = this.request.body;
  this.body = yield homeRecommendService.createHomeRecommend(body);
}