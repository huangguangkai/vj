'use strict';

module.exports = function ( router ) {
  router.get('/', index);
  router.get('/test-data', testData);
};

function* index() {
  this.body = 'vj server!';
}

function* testData() {
  const result = yield models.PhotoCategory.findAll({
    include: [
      {
        model: models.Photo,
        as: 'photos'
      },
      {
        model: models.PhotoPackage,
        as: 'packages'
      }
    ]
  });
  this.body = result;
}