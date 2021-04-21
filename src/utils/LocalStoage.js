const LocalStoage = {};

// const KEYS = "zxhj_userInfo";

LocalStoage.getItem = function (KEYS) {
  // console.log(localStorage.getItem(KEYS), 'localStorage.getItem(KEYS)')
  return localStorage.getItem(KEYS);
};

LocalStoage.setItem = function (KEY, data) {
  localStorage.setItem(KEY, JSON.stringify(data));
};

export default LocalStoage;
