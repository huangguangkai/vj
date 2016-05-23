'use strict';

const config = require('../../config');

const videoService = require('../services/video_service');

module.exports = function ( router ) {
  router.get('/', getVideos);
  router.put('/:id', putVideoById);
};

/**
 * 获取视频列表
 */
function* getVideos() {
  const query = this.query;
  const condition = this.request.condition;

  const result = yield videoService.findAndCountVideos({
    where: {
      delete_status: query.delete_status
    },
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
 * 修改视频
 */
function* putVideoById() {
  const id = this.params.id;
  const body = this.request.body;

  this.body = yield videoService.updateVideo(body, {
    id: id
  });
}