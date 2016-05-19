'use strict';

exports.findOne = function* ( query ) {
  return yield models.Admin.findOne(query);
};


exports.create = function* ( username, password ) {
  return yield models.Admin.create({
    username: username,
    password: password,
    nickname: username,
  });
};
