'use strict';

define([
  'jquery',
  'swiper',
  'lazyload',
  './components/menus',
  './components/contact',
  './components/photo',
  ], function ($, Swiper, lazyload, menus, contact, photo) {

  var app = {

  };

  app.init = function appInit (options) {

    this.options = options;

    menus.init();
    contact.init();

    if (APP.photos) {
      photo.init(APP.photos, {
        staticPrefix: options.staticPrefix
      });
    }

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