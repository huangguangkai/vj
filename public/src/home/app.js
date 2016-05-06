'use strict';

define([
  'jquery',
  'swiper',
  'lazyload',
  'home/components/menus',
  'home/components/contact',
  ], function ($, Swiper, lazyload, menus, contact) {

  var app = {

  };

  app.init = function appInit () {
    menus.init();
    contact.init();

    $('.J_Lazy').lazyload({
      effect : 'fadeIn',
    });

    this.swiper = new Swiper('#J_Swiper', {
      direction: 'horizontal',
      loop: true,
      autoplay: 3000,
      speed: 1000,
      pagination : '.swiper-pagination',
      paginationClickable: true,
      lazyLoading: true,
      lazyLoadingOnTransitionStart: true,
      autoplayDisableOnInteraction: false
    });
  };

  return app;

});