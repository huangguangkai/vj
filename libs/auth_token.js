'use strict';

module.exports = {
  defaultToken: '1463565456-d61a7f7ea9e34b07b21130f4bd0d5195',
  parseFromHeaders( header ) {
    if ( !header ) {
      throw ('Header is null');
    }
    if ( !header.hasOwnProperty('authorization') ) {
      throw ('Authorization header is null');
    }

    var authorization = header.authorization;
    var authArr       = authorization.split(' ');

    if ( authArr.length !== 2 ) {
      throw ('Authorization header value is not of length 2');
    }

    var name = authArr[0];
    if ( name !== 'token' ) {
      throw ('Authorization header value name is not token');
    }
    var token = authArr[1];
    if ( token.length !== this.TOKEN_LENGTH ) {
      throw ('Token length is not the expected one');
    }

    return token;
  },
  TOKEN_LENGTH: 10 + 1 + 32
};