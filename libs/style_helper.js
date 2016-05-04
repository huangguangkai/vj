'use strict';

/**
 * 往页面中插入指定的样式文件
 */

const StyleHelper = function ( isDev, staticPrefix ) {
  this.isDev        = isDev || false;
  this.staticPrefix = staticPrefix || '';

  return this;
};

StyleHelper.prototype = {
  constructor: StyleHelper,
  render: function ( path, ver ) {
    const isDev        = this.isDev,
          staticPrefix = this.staticPrefix;

    if ( isDev ) {
      return ('<link rel="stylesheet/less" href="' + staticPrefix + '/less' + path + '.less?' + (ver ? ('?v=' + ver) : Date.now()) + '">');
    } else {
      return ('<link rel="stylesheet" href="' + staticPrefix + '/css' + path + '.css' + (ver ? ('?v=' + ver) : '') + '">');
    }
  }
};

module.exports = StyleHelper;
