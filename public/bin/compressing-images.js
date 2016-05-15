'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var tinify = require('tinify');
tinify.key = '4ZUb9g3eIUR5UOt_JnKuatxdd8MZMe_F';

var root = __dirname;
var imgDir = path.resolve(root, '..', 'img');

var getImgs = {
  imgs: [],
  readDir: function (p) {
    return fs.readdirSync(p);
  },
  recurseAll: function (parent) {
    let files = this.readDir(parent);
    files.map(function (file) {
      let ext = path.extname(file);
      let child = path.resolve(parent, file);

      if (ext === '.png' || ext === '.jpg') {
        this.imgs.push(child);
      } else if (this.isDir(child)) {
        this.recurseAll(child);
      }
    }, this);

    return this.imgs;
  },
  recurseModified: function (dir, callback) {
    const self = this;
    let cmd = 'git status ' + dir + ' -s';
    exec(cmd, function (err, stdout, stderr) {

      if (err) {
        console.error(JSON.stringify(err));
        return false;
      }

      let oArr = stdout.split('\n');

      oArr.forEach(function (str) {
        str = str.slice(3);
        let file = path.resolve(dir, '..', str);
        let ext = path.extname(file);

        if (ext === '.png' || ext === '.jpg') {
          if (self.isExist(file)) {
            self.imgs.push(file);
          }
        } else {
          return false;
        }
      });

      callback(self.imgs);
    });
  },
  isExist: function (f) {
    return fs.existsSync(f);
  },
  isDir: function (p) {
    return fs.statSync(p).isDirectory();
  }
};

var compressing = function (img) {
  var source = tinify.fromFile(img);
  source.toFile(img);
  console.log('compressing', img);
  return source;
};

// var imgs = getImgs.recurseAll(imgDir);
// imgs.map(function (img) {
//   compressing(img);
// });

getImgs.recurseModified(imgDir, function (imgs) {
  imgs.map(function (img) {
    compressing(img);
  });
});
