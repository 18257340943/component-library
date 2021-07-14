
declare function setCookie(key: string, value: string): void;

declare function getCookie(key: string): string;

declare function delCookie(key: string): void;


interface Cookie {
  setCookie: typeof setCookie,
  getCookie: typeof getCookie,
  delCookie: typeof delCookie
}


declare const cookie: Cookie;

export default cookie;