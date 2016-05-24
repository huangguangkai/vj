'use strict';

const config = require('../../config');

const staffService = require('../services/staff_service');

module.exports = function ( router ) {
  router.get('/', getStaffs);
  router.get('/:id', getStaffById);
  router.put('/:id', putStaffById);
  router.post('/', postStaff);
};

/**
 * 获取成员
 */
function* getStaffs() {
  const condition = this.request.condition;
  const query = this.query;


  const result = yield staffService.findAndCountStaffs({
    where: {delete_status: query.delete_status},
    order: [['index', 'DESC'],['updated_at', 'DESC']],
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
 * 获取成员
 */
function* getStaffById() {
  const id = this.params.id;
  this.body = yield staffService.findStaffById(id);
}

/**
 * 修改成员
 */
function* putStaffById() {
  const id = this.params.id;
  const body = this.request.body;

  const result = yield staffService.updateStaff(body, {
    id: id
  });
  this.body = result;
}

/**
 * 创建成员
 */
function* postStaff() {
  const body = this.request.body;
  this.body = yield staffService.createStaff(body);
}