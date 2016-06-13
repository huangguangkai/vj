'use strict';

define([
  'jquery',
  'swiper',
  'lazyload',
  'cookie',
  './components/menus',
  './components/contact',
  './components/photo',
  './components/scrollup',
  ], function ($, Swiper, lazyload, Cookies, menus, contact, photo, scrollUp) {

  var app = {

  };

  app.lang = function () {
    $(document).on('click', '.J_Lang', function () {
      var lang = Cookies.get('lang') || 'CN';
      var newLang = '';

      switch (lang) {
        case 'CN':
        newLang = 'EN';
        break;
        case 'EN':
        newLang = 'CN';
        break;
      }

      Cookies.set('lang', newLang, { expires: 365 });

      location.reload();
    });
  };

  app.init = function appInit (options) {

    this.options = options;

    menus.init();
    contact.init();
    scrollUp.init();
    this.lang();

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