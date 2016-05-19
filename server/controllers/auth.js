'use strict';

module.exports = function ( router ) {
  router.get('/logout', logout);
  router.get('/test', testAuth);
};


function* logout() {
  const userId = this.user.id;

  console.log(this.user);

  try {
    yield authService.logout(userId, this.token);
    this.body = { user_id: userId };
  } catch ( error ) {
    this.body = {};
  }
}


function* testAuth() {
  this.body = this.user;
}
