'use strict';

const _ = require('lodash');

const authToken = require('../../libs/auth_token');

exports.login = function* ( username, password ) {
  const admin = yield models.Admin.findOne({ where: { username: username } });
  if ( !admin ) {
    throw ('admin not exist');
  }

  if ( !admin.authenticate(password) ) {
    throw ('password invalid');
  }

  const adminData = {
    id: admin.id,
    username: admin.username,
    nickname: admin.nickname,
    created_at: admin.created_at
  };

  const token = authToken.defaultToken;

  return {
    admin: adminData,
    token: token
  }
};


/**
 * 注销当前用户
 */
exports.logout = function *() {
};
