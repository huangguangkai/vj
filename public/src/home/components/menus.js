'use strict';

define(['jquery'], function ($) {

  var menus = {
    ele: '.J_HasSubMenu',
    subEle: '.J_SubMenu',
    init: function menuInit () {
      var self = this;
      var $ele = $(self.ele);

      $ele.hover(
        function () {
          var $sub = $(this).find(self.subEle);
          $sub.slideDown(100);
        },
        function () {
          var $sub = $(this).find(self.subEle);
          $sub.slideUp(100);
        }
      );
    }
  };

  return menus;

});