'use strict';

define([
  'jquery',
  'swiper',
  'lazyload',
  'home/components/menus',
  ], function ($, Swiper, lazyload, menus) {

  var app = {

  };

  app.init = function appInit () {
    menus.init();

    $('.J_Lazy').lazyload({
      effect : 'fadeIn',
    });

    this.swiper = new Swiper('#J_Swiper', {
      direction: 'horizontal',
      loop: true,
      autoplay: 300000,
      speed: 1000,
      pagination : '.swiper-pagination',
      paginationClickable: true,
      lazyLoading: true,
      lazyLoadingOnTransitionStart: true
    });
  };

  return app;

});