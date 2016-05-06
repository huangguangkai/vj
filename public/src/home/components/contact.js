'use strict';

define(['jquery'], function ($) {

  var contact = {
    ele: '.J_HasSubContact',
    subEle: '.J_SubContact',
    init: function contactInit () {
      var self = this;
      var $ele = $(self.ele);

      $ele.find('a').hover(
        function () {
          $(this).parent().addClass('active');
        },
        function () {
          $(this).parent().removeClass('active');
        }
      );
    }
  };

  return contact;

});