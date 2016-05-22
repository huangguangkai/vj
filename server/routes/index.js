'use strict';
const config = require('../../config');
const auth = require('../middlewares/auth_token');
const authToken = require('../../libs/auth_token');

const bannerService = require('../services/banner_service');
const homeRecommendService = require('../services/home_recommend_service');
const photoCategoryService = require('../services/photo_category_service');
const photoPackageService = require('../services/photo_package_service');
const photoService = require('../services/photo_service');
const videoService = require('../services/video_service');
const staffService = require('../services/staff_service');
const adminService = require('../services/admin_service');

module.exports = function ( router ) {
  router.get('/', index);

  router.get('/wedding-photo', weddingPhoto);
  router.get('/wedding-video', weddingVideo);
  router.get('/wedding-dress', weddingDress);

  router.get('/c/:cid', getCategory);
  router.get('/p/:pid', getPackage);
  router.get('/v/:vid', getVideo);

  router.get('/personal', personal);
  router.get('/pregnant', pregnant);
  router.get('/children', children);

  router.get('/about', about);

  router.post('/auth/login', login);

  router.use('*', auth());
  // 以下路由都去要授权登录才能访问
};

function* index() {

  const banners = yield bannerService.findBanners({
    raw: true
  });

  const recommends = yield homeRecommendService.findHomeRecommends({
    raw: true
  });

  const list = recommends.map(function(recommend) {
    return {
      name: recommend.title,
      name_image: recommend.title_image,
      url: recommend.url,
      cover_url: recommend.cover_url
    }
  });

  yield this.render('home/index', {
    title: '首页',
    banners: banners,
    list: list
  });
}

function* weddingPhoto() {
  const result = yield photoCategoryService
  .findPhotoCategoryById(CONSTANTS.PHOTO_CATEGORY.WEDDING_PHOTO.id, {
    include: [
      {
        model: models.Photo,
        as: 'photos',
        where: {
          delete_status: CONSTANTS.PHOTO.DELETE_STATUS.DEFAULT,
          recommend_status: CONSTANTS.PHOTO.RECOMMEND_STATUS.CATEGORY
        },
        order: [['updated_at', 'DESC']],
        required: false,
      },
      {
        model: models.PhotoPackage,
        where: {
          delete_status: CONSTANTS.PHOTO_PACKAGE.DELETE_STATUS.DEFAULT
        },
        as: 'packages',
        required: false,
      },
    ],
  });

  const list = result.packages.map(function (p) {
    return {
      id: p.id,
      name: p.name,
      name_image: p.name_image,
      url: `/p/${p.id}`,
      cover_url: p.cover_url
    }
  });

  yield this.render('home/wedding', {
    title: '婚礼照片',
    video: {
      video_url: result.video_url,
    },
    photos: result.photos,
    list: list
  });
}

function* weddingVideo() {
  const result = yield videoService.findVideos({
    order: [['created_at', 'DESC']],
    raw: true
  });

  const list = result.map(function (video) {
    return {
      url: `/v/${video.id}`,
      name_image: video.title_image,
      name: video.title,
      cover_url: video.cover_url
    }
  });

  yield this.render('home/list', {
    title: '婚礼视频',
    list: list
  });
}

function* weddingDress() {

  const PHOTO_CATEGORY = CONSTANTS.PHOTO_CATEGORY;
  const WEDDING_DRESS_TRIP = PHOTO_CATEGORY.WEDDING_DRESS_TRIP;
  const WEDDING_DRESS_AMOY = PHOTO_CATEGORY.WEDDING_DRESS_AMOY;

  const result = yield photoPackageService.findPhotoPackages({
    where: {
      category_id: WEDDING_DRESS_TRIP.id,
      delete_status: CONSTANTS.PHOTO_PACKAGE.DELETE_STATUS.DEFAULT
    },
    order: [['created_at', 'DESC']],
    raw: true
  });

  const category = yield photoCategoryService
  .findPhotoCategoryById(WEDDING_DRESS_AMOY.id, {
    raw: true
  });

  const list = result.map(function (p) {
    return {
      id: p.id,
      url: `/p/${p.id}`,
      name_image: p.name_image,
      name: p.name,
      cover_url: p.cover_url
    }
  });

  list.unshift({
    id: category.id,
    url: `/c/${category.id}`,
    name_image: category.name_image,
    name: category.name,
    cover_url: category.cover_url
  });

  yield this.render('home/list', {
    title: '婚纱',
    list: list
  });
}

function* getCategory() {
  const cid = this.params.cid;

  const result = yield photoCategoryService.findPhotoCategoryById(cid, {
    include: [
      {
        model: models.PhotoPackage,
        where: {
          delete_status: CONSTANTS.PHOTO_PACKAGE.DELETE_STATUS.DEFAULT
        },
        as: 'packages',
        order: [['created_at', 'DESC']],
        required: false
      },
    ],
  });

  const list = result.packages.map(function (p) {
    return {
      id: p.id,
      url: `/p/${p.id}`,
      name_image: p.name_image,
      name: p.name,
      cover_url: p.cover_url
    }
  });

  yield this.render('home/list', {
    title: result.name,
    list: list,
  });
}

function* getPackage() {
  const pid = this.params.pid;

  const result = yield photoPackageService.findPhotoPackageById(pid, {
    include: [
      {
        model: models.Photo,
        as: 'photos',
        order: [['updated_at', 'DESC']],
        where: {
          delete_status: CONSTANTS.PHOTO.DELETE_STATUS.DEFAULT
        },
        required: false,
        raw: true
      },
    ],
  });

  const photos = result.photos;

  if (result.description_url) {
    photos.unshift({
      main: true,
      cover_url: result.description_url,
    });
  }

  yield this.render('home/detail', {
    title: `${result.name || 'detail'}`,
    video: {
      video_url: result.video_url,
    },
    photos: photos
  });
}

function* getVideo() {
  const vid = this.params.vid;

  const result = yield videoService.findVideoById(vid, {
    raw: true
  });

  yield this.render('home/video', {
    title: `${result.title || 'video'}`,
    video: result,
  });
}

function* personal() {
  const cid = CONSTANTS.PHOTO_CATEGORY.PERSONAL.id;
  yield n.call(this, cid);
}

function* pregnant() {
  const cid = CONSTANTS.PHOTO_CATEGORY.PREGNANT.id;
  yield n.call(this, cid);
}

function* children() {
  const cid = CONSTANTS.PHOTO_CATEGORY.CHILDREN.id;
  yield n.call(this, cid);
}

function* n(cid) {

  const result = yield photoCategoryService
  .findPhotoCategoryById(cid, {
    include: [
      {
        model: models.Photo,
        as: 'photos',
        order: [['created_at', 'DESC']],
        required: false,
      },
      {
        model: models.PhotoPackage,
        as: 'packages',
        required: false,
      },
    ],
  });

  if (result.packages.length > 1) {

    const list = result.packages.map(function (p) {
      return {
        id: p.id,
        url: `/p/${p.id}`,
        name_image: p.name_image,
        name: p.name,
        cover_url: p.cover_url
      }
    });

    yield this.render('home/list', {
      title: result.name,
      list: list,
    });
  } else if (result.packages.length === 1) {
    const p = result.packages[0];

    const photos = yield photoService.findPhotos({
      where: {
        package_id: p.id
      },
      order: [['created_at', 'DESC']],
      raw: true
    });

    if (p.description_url) {
      photos.unshift({
        main: true,
        cover_url: p.description_url,
      });
    }

    yield this.render('home/detail', {
      title: `${p.name || 'detail'}`,
      video: {
        video_url: p.video_url,
      },
      photos: photos
    });

  } else {

    yield this.render('home/detail', {
      title: `${result.name || 'detail'}`,
      video: {
        video_url: result.video_url,
      },
      photos: result.photos
    });

  }
}

function* about() {

  const result = yield staffService
  .findStaffs({
    order: [['index', 'DESC']],
    raw: true
  });

  yield this.render('home/about', {
    title: '关于我们',
    list: result
  });
}

function* login() {
  const body     = this.request.body;
  const username = body.username;
  const password = body.password;

  const admin = yield adminService.findOne({
    where: {
      username: username
    }
  });

  if ( !admin ) {
    throw ('admin not exist');
  }

  if ( !admin.authenticate(password) ) {
    throw ('password invalid');
  }

  const adminId = admin.id;

  const adminData = {
    id: adminId,
    username: admin.username,
    nickname: admin.nickname,
    created_at: admin.created_at
  };

  const token = authToken.createAndStore(adminId, adminData, authToken.TOKEN_EXPIRE);

  this.body = {
    admin: adminData,
    token: token
  }
}