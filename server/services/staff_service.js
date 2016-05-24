'use strict';

exports.findStaffs = function*(query) {
  return yield models.Staff.findAll(query);
}

exports.findStaffById = function*(id) {
  return yield models.Staff.findById(id);
}

exports.findAndCountStaffs = function*(query) {
  return yield models.Staff.findAndCountAll(query);
}

exports.updateStaff = function*(body, where) {
  body.updated_at = new Date();
  return yield models.Staff.update(body, {
    where: where
  });
}

exports.createStaff = function*(body) {
  return yield models.Staff.create(body);
};