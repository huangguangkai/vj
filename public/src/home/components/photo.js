'use strict';

define(['jquery', 'popup'], function ($, Popup) {

  var photo = {
    ele: '.J_Photo',
    content: '#J_PhotoContent',
    prev: '#J_PhotoPrev',
    next: '#J_PhotoNext',
    close: '#J_PhotoClose',
    initDialog: function (photo) {
      var self = this;
      var dialog = this.dialog = new Popup();
      dialog.fixed = true;
      dialog.innerHTML =
       '<div class="ui-dialog">'
      + '<div id="' + self.content.replace('#', '') + '" class="bd"></div>'
      + '<div class="ft">'
      + '<div class="prev" id="' + self.prev.replace('#', '') + '">prev</div>'
      + '<div class="next" id="' + self.next.replace('#', '') + '">next</div>'
      + '<div class="close" id="' + self.close.replace('#', '') + '">close</div>'
      + '</div>'
      +'</div>';

      dialog.showModal();

      $(self.close).one('click', function () {
        self.destroyDialog();
      });

      $(dialog.backdrop).one('click', function () {
        self.destroyDialog();
      });

      $(document).on('keyup.photo', function (e) {
        var keyCode = e.keyCode;
        if (keyCode == 37) {
          self.handlePrev();
        }

        if ( keyCode == 39) {
          self.handleNext();
        }

        if ( keyCode == 27) {
          self.destroyDialog();
        }
      });
    },
    destroyDialog: function () {
      this.dialog.close().remove();
      $(document).off('keyup.photo');
    },
    modifyDialog: function (photo) {
      var self = this;
      var loading = APP.staticPrefix + '/img/loading.gif';
      var $content = $(this.content);

      $content.html('<img class="loading" src="' + loading + '" />');
      self.dialog.reset();

      $('<img/>').on('load', function () {
        setTimeout(function () {
          $content.html('<img class="pic" style="display:none;" src="' + photo + '?imageView2/2/w/800/h/600" />');
          $content.find('.pic').fadeIn();
          self.dialog.reset();
        }, 100);
      }).attr("src", (photo + '?imageView2/2/w/800/h/600'));

    },
    checkDisabled: function () {
      if (this.prevId < 0) {
        $(this.prev).addClass('disabled');
      } else {
        $(this.prev).removeClass('disabled');
      }

      if (this.nextId >= this.photos.length) {
        $(this.next).addClass('disabled');
      } else {
        $(this.next).removeClass('disabled');
      }
    },
    handlePrev: function () {
      var photoId = this.prevId;
      if (photoId >= 0) {
        var photo = this.photo = $('#J_Photo_' + photoId).data('photo');
        if (photo) {
          this.modifyDialog(photo);
          this.photoId = photoId;
          this.prevId = photoId - 1;
          this.nextId = photoId + 1;
          this.checkDisabled();
        }
      }
    },
    handleNext: function () {
      var photoId = this.nextId;
      if (photoId < this.photos.length) {
        var photo = this.photo = $('#J_Photo_' + photoId).data('photo');
        if (photo) {
          this.modifyDialog(photo);
          this.photoId = photoId;
          this.prevId = photoId - 1;
          this.nextId = photoId + 1;
          this.checkDisabled();
        }
      }
    },
    init: function (photos, options) {
      this.photos = photos;
      this.options = options;

      var self = this;
      var $doc = $(document);

      $doc.on('click', self.ele, function () {
        var photo = self.photo = $(this).data('photo');
        if (photo) {
          self.initDialog();
          self.modifyDialog(photo);
          var photoId = self.photoId = $(this).data('id');
          self.prevId = photoId - 1;
          self.nextId = photoId + 1;
          self.checkDisabled();
        }
      });

      $doc.on('click', self.prev, function () {
        self.handlePrev();
      });

      $doc.on('click', self.next, function () {
        self.handleNext();
      });
    }
  };

  return photo;

});