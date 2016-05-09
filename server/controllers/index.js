'use strict';

module.exports = function ( router ) {
  router.get('/', index);
  router.get('/wedding', wedding);
  router.get('/list', list);
  router.get('/video', video);
  router.get('/detail', detail);
  router.get('/about', about);
};

function* index() {
  yield this.render('home/index', {
    title: 'VJ'
  });
}

function* wedding() {
  yield this.render('home/wedding', {
    title: 'VJ'
  });
}

function* list() {
  yield this.render('home/list', {
    title: 'VJ'
  });
}

function* video() {
  yield this.render('home/video', {
    title: 'VJ'
  });
}

function* detail() {
  yield this.render('home/detail', {
    title: 'VJ'
  });
}

function* about() {
  yield this.render('home/about', {
    title: 'VJ'
  });
}