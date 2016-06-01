'use strict';

define(['jquery'], function ($) {

  var scrollUp = {
    ele: '#J_ScrollUp',
    init: function scrollUpInit () {
      var self = this;
      var $ele = $(self.ele);
      var $win = $(window);

      $win.on('scroll.scrollup', function (e) {
        var top = $win.scrollTop();
        if (top > 100) {
          $ele.addClass('show');
        } else {
          $ele.removeClass('show');
        }
      });

      $ele.on('click', function () {
        $('html,body').animate({
          scrollTop: 0
        }, 300);
      });
    }
  };

  return scrollUp;

});