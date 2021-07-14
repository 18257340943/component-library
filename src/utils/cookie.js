// 写cookies
import initEnv from './initEnv';
const { domain } = initEnv;

function setCookie(name, value) {
  let Days = 30;
  let exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${escape(value)};path=/;${domain}expires=${exp.toGMTString()}`;
}
// 读取cookies
function getCookie(name) {
  let arr;
  let reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  arr = document.cookie.match(reg)
  if (arr)
    return unescape(arr[2]);
  else
    return null;
}

// 删除cookies
function delCookie(name) {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = getCookie(name);
  if (cval != null)
    document.cookie = `${name}=${cval};path=/;${domain}expires=${exp.toGMTString()}`;
}

const cookie = {
  setCookie,
  getCookie,
  delCookie
};

export default cookie;
