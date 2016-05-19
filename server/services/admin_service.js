'use strict';

exports.create = function* ( username, password ) {
  return yield models.Admin.create({
    username: username,
    password: password,
    nickname: username,
  });
};
