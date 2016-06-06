'use strict';

define(['jquery'], function ($) {

  var menus = {
    ele: '.J_HasSubMenu',
    subEle: '.J_SubMenu',
    menusEle: '#J_Menus',
    mobileMenusEle: '#J_MobileMenus',
    init: function menuInit () {
      var self = this;
      var $ele = $(self.ele);
      var $mobileMenus = $(self.mobileMenusEle);

      $(self.menusEle).find(self.ele).hover(
        function () {
          var $sub = $(this).find(self.subEle);
          $sub.slideDown(100);
        },
        function () {
          var $sub = $(this).find(self.subEle);
          $sub.slideUp(100);
        }
      );

      $mobileMenus.find(self.ele)
      .on('click', function () {
        var $sub = $(this).find(self.subEle);
        $sub.slideToggle(100);
      });

      $mobileMenus.find('.menus-toggle')
      .on('click', function () {
        if ($mobileMenus.hasClass('show')) {
          $mobileMenus.removeClass('show');
        } else {
          $mobileMenus.addClass('show');
        }
      });
    }
  };

  return menus;

});