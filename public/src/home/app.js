'use strict';

define(['jquery', 'home/components/menus'], function ($, menus) {

  var app = {

  };

  app.init = function appInit () {
    menus.init();
  };

  return app;

});