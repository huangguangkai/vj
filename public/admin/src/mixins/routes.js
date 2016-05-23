
export default {
  modules: [
    {
      name: '照片管理',
      routeReg: /^\/photo/,
      items: [
        {route: '/photo/list', text: '照片'},
        {route: '/photo/category', text: '分类'},
        {route: '/photo/package', text: '套餐'},
      ],
    },
    {
      name: '运营管理',
      routeReg: /^\/coo/,
      items: [
        {route: '/coo/banner', text: '首页广告'},
        {route: '/coo/recommend', text: '首页推荐'},
      ],
    },
    {
      name: '视频管理',
      routeReg: /^\/video/,
      items: [
        {route: '/video/list', text: '婚礼视频'},
      ],
    },
    {
      name: '团队管理',
      routeReg: /^\/group/,
      items: [
        {route: '/group/photographer', text: '摄影师'},
      ],
    },
  ],
};