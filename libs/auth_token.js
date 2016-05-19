'use strict';

const moment = require('moment');
const utils = require('./utils');

module.exports = {
  TOKEN_EXPIRE: 60 * 60 * 24 * 7, // 7 days
  TOKEN_LENGTH: 10 + 1 + 32,

  prefix: 'vj:',

  createToken() {
    return `${moment().unix()}-${utils.uuid32()}`;
  },

  authTokenKey( token ) {
    return this.prefix + token;
  },
  authUserIdTokensKey( userId ) {
    return `${this.prefix}${userId}:tokens`;
  },

  createAndStore( userId, data, ttl ) {
    if ( !data && typeof data !== 'object' ) {
      throw ('data is not an Object');
    }
    if ( !ttl && typeof ttl !== 'number' ) {
      throw ('ttl is not a valid Number');
    }

    const token = this.createToken();

    this.setUserTokenData(userId, token, data, ttl);

    return token;
  },
  setUserTokenData( userId, token, data, ttl ) {
    if ( !token ) {
      throw ('Token is null');
    }
    if ( typeof data !== 'object' ) {
      throw ('data is not an Object');
    }

    const userData = data || {};
    userData._ts   = new Date();

    if ( typeof ttl !== 'number' ) {
      throw ('TimeToLive is not a Number');
    }

    return redisClient.multi()
    .setex(
      this.authTokenKey(token),
      ttl,
      JSON.stringify(userData))
    .sadd(this.authUserIdTokensKey(userId), token)
    .exec();
  },
  getDataByToken( token ) {
    if ( !token ) {
      throw ('Token is null');
    }

    const promise = redisClient.get(this.authTokenKey(token));

    return promise.then(data => {
      if ( !data ) {
        return Promise.reject(new Error('Token is invalid'));
      }

      return Promise.resolve(JSON.parse(data));
    }).catch(err => {
      return Promise.reject(err);
    });
  },
  expireUserToken( userId, token ) {
    return redisClient.multi()
      .del(this.authTokenKey(token))
      .srem(this.authUserIdTokensKey(userId), token)
      .exec();
  },
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
};