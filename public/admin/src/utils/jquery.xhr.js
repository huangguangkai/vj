'use strict';

/**
 * 实现统一的IO接口处理
 */

import history from './history'
import * as auth from './auth'

const xhr = {};

xhr.ajax = function (param) {
    const self = this;
    const def = $.Deferred();

    param.dataType = param.dataType || 'json';
    param.headers = {
        Authorization: 'token ' + auth.getToken(),
    };

    const _xhr = $.ajax(param);

    setTimeout(function () {
        _xhr.done(function () {
            def.resolve.apply(self, arguments);
        }).fail(function (ret) {
            if (ret.status === 401 && ret.statusText === 'Unauthorized') {
                history.pushState(null, '/login');
            }
            def.reject.apply(self, arguments);
        });
    }, 100)

    return def.promise();
};

String('get, post, put, delete').replace(/\w+/g, function(type) {
    xhr[type] = function(url, data, callback, dataType) {
        if($.isFunction(data)) {
            dataType = callback;
            callback = data;
            data = undefined;
        }

        var param = {
            url: url,
            type: type,
            data: data,
            dataType: dataType,
            success: callback,
        };

        var xhr = this.ajax(param);

        return xhr;
    };
});

export default xhr