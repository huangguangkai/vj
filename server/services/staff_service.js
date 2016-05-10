'use strict';

exports.findStaffs = function*(query) {
  return yield models.Staff.findAll(query);
}