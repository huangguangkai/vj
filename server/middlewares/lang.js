'use strict';

module.exports = function () {

  return function* lang( next ) {
    let cookie = this.cookies.get('lang');
    let acceptLang = this.acceptsLanguages()[0];

    let lang = 'CN';

    if (cookie) {
      lang = cookie;
    } else {

      if (acceptLang && (acceptLang.toLowerCase().indexOf('en') !== -1)) {
        lang = 'EN';
      } else {
        lang = 'CN';
      }

      this.cookies.set('lang', lang, {
        expires: new Date(Date.now() + 1000*60*60*24*365),
        httpOnly: false
      });
    }

    this.lang = lang;

    yield* next;
  };
};


