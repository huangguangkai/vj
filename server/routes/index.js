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
  router.get('/prewedding', prewedding);

  router.get('/c/:cid', getCategory);
  router.get('/p/:pid', getPackage);
  router.get('/v/:vid', getVideo);

  router.get('/portrait', portrait);
  router.get('/pregnant', pregnant);
  router.get('/children', children);

  router.get('/about', about);

  router.post('/auth/login', login);

  router.use('*', auth());
  // 以下路由都去要授权登录才能访问
};

function* index() {

  const banners = yield bannerService.findBanners({
    order: [['updated_at', 'DESC']],
    where: {
      delete_status: CONSTANTS.BANNER.DELETE_STATUS.DEFAULT
    },
    raw: true
  });

  const recommends = yield homeRecommendService.findHomeRecommends({
    where: {
      delete_status: CONSTANTS.HOME_RECOMMEND.DELETE_STATUS.DEFAULT
    },
    order: [
      ['index', 'DESC'],
      ['updated_at', 'DESC']
    ],
    raw: true
  });

  const list = recommends.map(function(recommend) {
    return {
      name: recommend.title,
      name_image: recommend.title_image,
      name_en: recommend.title_en,
      name_image_en: recommend.title_image_en,
      url: recommend.url,
      cover_url: recommend.cover_url,
    }
  });

  yield this.render('home/index', {
    title: this.lang == CONSTANTS.LANG.EN ? 'Home' : '首页',
    banners: banners,
    list: list,
    lang: this.lang
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
      name_en: p.name_en,
      name_image_en: p.name_image_en,
      url: `/p/${p.id}`,
      cover_url: p.cover_url
    }
  });

  yield this.render('home/wedding', {
    title: this.lang == CONSTANTS.LANG.EN ? 'Wedding Photos' : '婚礼照片',
    video: {
      video_url: result.video_url,
    },
    photos: result.photos,
    list: list,
    lang: this.lang
  });
}

function* weddingVideo() {
  const result = yield videoService.findVideos({
    where: {
      delete_status: CONSTANTS.VIDEO.DELETE_STATUS.DEFAULT
    },
    order: [['updated_at', 'DESC']],
    raw: true
  });

  const list = result.map(function (video) {
    return {
      url: `/v/${video.id}`,
      name_image: video.title_image,
      name: video.title,
      name_en: video.title_en,
      name_image_en: video.title_image_en,
      cover_url: video.cover_url
    }
  });

  yield this.render('home/list', {
    title: this.lang == CONSTANTS.LANG.EN ? 'Wedding Videos' : '婚礼视频',
    list: list,
    lang: this.lang
  });
}

function* prewedding() {

  const PHOTO_CATEGORY = CONSTANTS.PHOTO_CATEGORY;
  const WEDDING_DRESS_TRIP = PHOTO_CATEGORY.WEDDING_DRESS_TRIP;
  const WEDDING_DRESS_AMOY = PHOTO_CATEGORY.WEDDING_DRESS_AMOY;

  const result = yield photoCategoryService
  .findPhotoCategoryById(WEDDING_DRESS_TRIP.id, {
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

  const category = yield photoCategoryService
  .findPhotoCategoryById(WEDDING_DRESS_AMOY.id, {
    raw: true
  });

  const list = result.packages.map(function (p) {
    return {
      id: p.id,
      url: `/p/${p.id}`,
      name_image: p.name_image,
      name: p.name,
      name_en: p.name_en,
      name_image_en: p.name_image_en,
      cover_url: p.cover_url
    }
  });

  list.unshift({
    id: category.id,
    url: `/c/${category.id}`,
    name_image: category.name_image,
    name: category.name,
    name_en: category.name_en,
    name_image_en: category.name_image_en,
    cover_url: category.cover_url,
  });

  yield this.render('home/prewedding', {
    title: this.lang == CONSTANTS.LANG.EN ? 'Prewedding' : '婚纱',
    video: {
      video_url: result.video_url,
    },
    photos: result.photos,
    list: list,
    lang: this.lang
  });
}

function* getCategory() {
  const cid = this.params.cid;

  const result = yield photoCategoryService.findPhotoCategoryById(cid, {
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
      name_en: p.name_en,
      name_image_en: p.name_image_en,
      cover_url: p.cover_url
    }
  });

  yield this.render('home/list', {
    title: this.lang == CONSTANTS.LANG.EN ? result.name_en : result.name,
    video: {
      video_url: result.video_url,
    },
    photos: result.photos,
    list: list,
    lang: this.lang
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

  // if (result.description_url || result.description) {
  //   photos.unshift({
  //     main: true,
  //     cover_url: result.description_url,
  //     description: result.description
  //   });
  // }

  yield this.render('home/detail', {
    title: `${(this.lang == CONSTANTS.LANG.EN ? (result.name_en || result.name) : result.name) || 'detail'}`,
    video: {
      video_url: result.video_url,
    },
    photos: photos,
    lang: this.lang
  });
}

function* getVideo() {
  const vid = this.params.vid;

  const result = yield videoService.findVideoById(vid, {
    raw: true
  });

  yield this.render('home/video', {
    title: `${(this.lang == CONSTANTS.LANG.EN ? (result.title_en || result.title) : result.title) || 'detail'}`,
    video: result,
    lang: this.lang
  });
}

function* portrait() {
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
        order: [['updated_at', 'DESC']],
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
        name_en: p.name_en,
        name_image_en: p.name_image_en,
        cover_url: p.cover_url
      }
    });

    yield this.render('home/list', {
      title: result.name,
      list: list,
      lang: this.lang
    });
  } else if (result.packages.length === 1) {
    const p = result.packages[0];

    const photos = yield photoService.findPhotos({
      where: {
        package_id: p.id
      },
      order: [['updated_at', 'DESC']],
      raw: true
    });

    if (p.description_url) {
      photos.unshift({
        main: true,
        cover_url: p.description_url,
      });
    }

    yield this.render('home/detail', {
      title: `${(this.lang == CONSTANTS.LANG.EN ? (p.name_en || p.name) : p.name) || 'detail'}`,
      video: {
        video_url: p.video_url,
      },
      photos: photos,
      lang: this.lang
    });

  } else {

    yield this.render('home/detail', {
      title: `${(this.lang == CONSTANTS.LANG.EN ? (result.name_en || result.name) : result.name) || 'detail'}`,
      video: {
        video_url: result.video_url,
      },
      photos: result.photos,
      lang: this.lang
    });

  }
}

function* about() {

  const result = yield staffService
  .findStaffs({
    where: {
      delete_status: CONSTANTS.STAFF.DELETE_STATUS.DEFAULT
    },
    order: [['index', 'DESC'], ['updated_at', 'DESC']],
    raw: true
  });

  yield this.render('home/about', {
    title: this.lang == CONSTANTS.LANG.EN ? 'About Us' : '关于我们',
    list: result,
    lang: this.lang
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