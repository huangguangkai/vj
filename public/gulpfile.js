'use strict';

/**
 *
 */

const fs = require('fs');
const path = require('path');

const gulp = require('gulp'),
  chalk = require('chalk'),
  argv = require('yargs').argv,
  less = require('gulp-less'),
  uglify = require('gulp-uglify'),
  minifyCSS = require('gulp-minify-css'),
  LessPluginAutoPrefix = require('less-plugin-autoprefix'),
  qiniu = require('gulp-qiniu'),
  rjs = require('requirejs'),
  rev = require('gulp-rev'),
  webpack = require('webpack-stream'),
  revCollector = require('gulp-rev-collector'),
  shell = require('shelljs');

const envConfig = require('../config');

const config = {
  qiniu: Object.assign({
    root: '/',
    bucket: 'vjstudio',
  }, envConfig.qiniu.keys),
  js: {
    src: './src',
    dest: './js'
  },
  less: {
    src: './less',
    dest: './css'
  },
  img: {
    src: './img'
  },
  lib: {
    root: './libs',
  }
};

gulp.task('default', function () {
  console.log(config);
});

gulp.task('less', function () {
  const fliePath = argv.path || '',
    file = argv.file || '*',

    src = path.join(config.less.src, fliePath, file + '.less'),
    dest = path.join(config.less.dest, fliePath);

  console.log(chalk.green('less:', src), chalk.green('->', dest));

  return gulp.src(src)
    .pipe(less({
      plugins: [new LessPluginAutoPrefix({ browsers: ["last 2 versions"] })]
    }))
    .pipe(gulp.dest(dest));

});

gulp.task('cssmin', ['less'], function () {
  const fliePath = argv.path || '',
    file = argv.file || '*',

    src = path.join(config.less.dest, fliePath, file + '.css'),
    dest = path.join(config.less.dest, fliePath);

  console.log(chalk.green('cssmin:', src), chalk.green('->', dest));

  return gulp.src(src)
    .pipe(minifyCSS())
    .pipe(gulp.dest(dest));

});

gulp.task('csspub', ['cssmin'], function () {
  const fliePath = argv.path || '',
    file = argv.file || '*',

    src = path.join(config.less.dest, fliePath, file + '.css');

  console.log(chalk.green('csspub:', src), chalk.green('-> qiniu...ing'));

  return publish(src, path.join(config.qiniu.root, config.less.dest, fliePath));

});

gulp.task('jsbuild', function (cb) {

  const fliePath = argv.path || '';
  const file = argv.file || '*';

  const name = path.join(fliePath, file);
  const out = path.join(config.js.dest, name);

  rjs.optimize({
    baseUrl: config.js.src,
    paths: {
      jquery: '../libs/jquery/jquery-2.1.4',
      swiper: '../libs/swiper/js/swiper.jquery.umd',
      lazyload: '../libs/jquery.lazyload/jquery.lazyload-1.9.7',
      popup: '../libs/popupjs/popup',
    },
    // optimize: 'none',
    name: name,
    out: out + '.js',
    exclude: [
      'jquery',
    ]
  }, function(buildResponse){
    // console.log('build response', buildResponse);
    cb();
  }, cb);
});

// gulp.task('jsmin', function () {
//   const fliePath = argv.path || '',
//     file = argv.file || '*',

//     src = path.join(config.js.src, fliePath, file + '.js'),
//     dest = path.join(config.js.dest, fliePath);

//   console.log(chalk.green('jsmin:', src), chalk.green('->', dest));

//   return gulp.src(src)
//     .pipe(uglify())
//     .pipe(gulp.dest(dest));

// });

gulp.task('jspub', ['jsbuild'], function () {
  const fliePath = argv.path || '',
    file = argv.file || '*',

    src = path.join(config.js.dest, fliePath, file + '.js');

  console.log(chalk.green('jspub:', src), chalk.green('-> qiniu...ing'));

  return publish(src, path.join(config.qiniu.root, config.js.dest, fliePath));

});

gulp.task('imgpub', [], function () {
  const fliePath = argv.path || '',
        file = argv.file || undefined;

  let src = null;

    if (file) {
      src = path.join(config.img.src, fliePath, file);
    } else {
      src = [
        path.join(config.img.src, fliePath, '**/*.png'),
        path.join(config.img.src, fliePath, '**/*.gif'),
        path.join(config.img.src, fliePath, '**/*.jpg'),];
    }

  console.log(chalk.green('imgpub:', src), chalk.green('-> qiniu...ing'));

  return publish(src, path.join(config.qiniu.root, config.img.src, fliePath));

});

gulp.task('libpub', [], function () {
  const fliePath = argv.path || '',
        file = argv.file || '**';

  const src = path.join(config.lib.root, fliePath, file);

  console.log(chalk.green('libpub:'), chalk.green('-> qiniu...ing'));

  return publish(src, path.join(config.lib.root, fliePath));

});

gulp.task('admin-build-js', function () {
  return gulp.src('./admin/src/**/*.jsx')
    .pipe(webpack(require('./webpack.config.prod')))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./admin/build/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./admin/build/rev/'));
});

gulp.task('admin-publish-js', ['admin-build-js'], function () {
  return publish('admin/build/*.js', 'admin');
});

gulp.task('admin-build-html', function () {
  return gulp.src(['./admin/build/rev/**/*.json', './admin/index.html'])
    .pipe(revCollector({
      replaceReved: true,
      dirReplacements: {
        'http://127.0.0.1:3089/admin/build/': envConfig.qiniu.buckets.static.prefix + '/admin/',
      },
    }))
    .pipe(gulp.dest('./admin/build/'));
});

gulp.task('admin-publish-html', ['admin-build-html'], function (cb) {
  const buildDir = path.join(__dirname, 'build');
  const indexHtmlFile = path.join(__dirname, 'admin', 'build', 'index.html');
  const env = process.env.NODE_ENV;

  const scripts = `scp ${indexHtmlFile} ${'stone'}:/root/vj/public/admin/build/`;
  shell.exec(scripts);
});

gulp.task('admin', ['admin-publish-js', 'admin-publish-html']);

function publish(src, dir) {
  console.log(src, dir);
  return gulp.src(src)
    .pipe(qiniu({
      accessKey: config.qiniu.access_key,
      secretKey: config.qiniu.secret_key,
      bucket: config.qiniu.bucket,
      private: false
    }, {
      dir: dir,
      versioning: false,
      // versionFile: './cdn.json',
      concurrent: 10
    }));

}