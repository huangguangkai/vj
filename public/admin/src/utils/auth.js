
export const getToken = function () {
  return localStorage.getItem('TOKEN');
}

export const storeToken = function (token) {
  return localStorage.setItem('TOKEN', token);
}

export const removeToken = function () {
  return localStorage.removeItem('TOKEN');
}