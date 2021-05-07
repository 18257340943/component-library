import { message } from "antd";

// import LocalStorge from "./LocalStoage";
import { getCookie } from './cookie';
import { search, removeEmptyField } from "./utils";
import initEnv from './initEnv';


function sleep(sleepTime) {
  console.log(`程序睡眠${sleepTime}ms`);
  for (let start = new Date(); new Date() - start <= sleepTime;) { }
}

// 支持 search 参数url化
function addSearch(url, init) {
  console.log(url, JSON.stringify(init), 'url')
  // eslint-disable-next-line no-unused-expressions
  init &&
    Object.keys(init).forEach((key) => {
      if (key === "search") {
        let searchObj = init[key];
        if (!searchObj) {
          throw Error("类型", "search对象传入值不能为null等");
        }
        searchObj = removeEmptyField(searchObj);
        // console.log(searchObj, 'searchObj')
        const searchUrl = search(searchObj);
        // console.log(searchUrl, ' searchUrl')
        url += searchUrl;
        delete init[key];
      }
    });
  return {
    newURL: url,
    newINIT: init,
  };
}

const _fetch = () => {
  // 定义用来存储拦截请求和拦截响应结果的处理函数集合
  const interceptors_req = [];
  const interceptors_res = [];

  function c_fetch(input, init = {}) {
    // fetch默认请求方式设为GET
    if (!init.method) {
      init.method = "POST";
    }
    // interceptors_req是拦截请求的拦截处理函数集合
    interceptors_req.forEach((interceptors) => {
      init = interceptors(init);
    });

    // 在原生fetch外面封装一个promise，为了在promise里面可以对fetch请求的结果做拦截处理。
    // 同时，保证c_fetch函数返回的结果是个promise对象。

    // console.log(input, init, 'input, init')
    return new Promise((resolve, reject) => {
      // 发起fetch请求，fetch请求的形参是接收上层函数的形参
      fetch(input, init)
        .then((res) => {
          // interceptors_res是拦截响应结果的拦截处理函数集合
          interceptors_res.forEach((interceptors) => {
            // console.log(interceptors, 'interceptors');
            // 拦截器对响应结果做  处理，把处理后的结果返回给响应结果。
            res = interceptors(res);
          });
          // console.log(res, 'res');
          return res.json();
        })
        .then((result) => {
          // console.log(result, 'result')
          const { data } = result;
          if (result.code !== 200) {
            message.error(data.message || "服务器异常！");
            return;
          }
          // 将拦截器处理后的响应结果resolve出去
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  c_fetch.interceptors = {
    request: {
      use(callback) {
        interceptors_req.push(callback);
      },
    },
    response: {
      use(callback) {
        interceptors_res.push(callback);
      },
    },
  };
  return c_fetch;
};




class AppState {
  constructor(fetch) {
    this._fetch = fetch;
    this.baseUrl = initEnv.baseUrl
  }

  // 针对请求路径和配置做进一步处理啊
  updateParams(url, init) {
    url = this.baseUrl + url;
    const { newURL, newINIT } = addSearch(url, init);
    return { newURL, newINIT };
  }

  static requestIntercept(config) {

    const loginToken = getCookie(initEnv.cookieName);

    // const loginToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBVURJVF9QVVJDSEFTRSIsIlBST0pFQ1RfRklOQU5DRSIsIkFVRElUX0JVSUxEIiwiU0hPUF9VU0VSIiwiQVVESVRfUFJPRFVDVCIsIkNMSUVOVF9BRE1JTiIsIlJFTlRfQURNSU4iLCJBVURJVF9DTEFTUyIsIlBST0pFQ1RfT1JERVIiLCJQUk9KRUNUX0FETUlOIiwiQVVESVRfRklOQU5DRSIsIkFVRElUX0FSRUEiLCJBVURJVF9NRUNISU5FIiwiQVVESVRfTEVHQUwiLCJQUk9KRUNUX1JFTlQiLCJQUk9KRUNUX0FVRElUIiwiUFJPSkVDVF9XQVJFSE9VU0UiLCJBVURJVF9QUk9KRUNUIiwiUFJPSkVDVF9ERVZJQ0UiLCJTSE9QX0FETUlOIiwiUFJPSkVDVF9QRVJTT04iLCJBVURJVF9TRUNVUklUWSIsIlJFTlRfVVNFUiIsIlBST0pFQ1RfVVNFUiIsIkFVRElUX1NUT1JFWSIsIkFVRElUX1JFQ0VJVkUiXSwidXNlcm5hbWUiOiJISCIsImlzcyI6InNpdGUuaGF5b25kLmFjY291bnQiLCJzdWIiOiI3OTMiLCJhdWQiOiJISCIsImlhdCI6MTYxOTUwMDE0MywiZXhwIjoxNjM1MDUyMTQzfQ.Tv22QCvh9IopzcCSZnElabHl-dthS2A2Ehuc6rOqQbs"
    // console.log(loginToken, 'loginToken');
    let { body } = config;
    const { headers } = config;
    const defaultHeaders = new Headers({
      "Content-Type": "application/json", // 默认上传类型
      ...headers
    });

    if (body) {
      if (Object.getPrototypeOf(body).constructor.name === "FormData") {
        defaultHeaders.delete("Content-Type");
      } else {
        body = JSON.stringify(removeEmptyField(body));
      }
    }

    // 请求前拦截，用户登录情况下写入请求头token
    if (loginToken) {
      defaultHeaders.append("Authorization", `Bearer ${loginToken}`);
    }

    return {
      ...config,
      headers: defaultHeaders,
      body,
    };
  }

  static responseIntercept(response) {
    return response;
  }

  fetch(url, init) {
    const c_fetch = this._fetch();
    const { newURL, newINIT } = this.updateParams(url, init);
    // console.log(newURL, 'newUrl')
    c_fetch.interceptors.request.use(AppState.requestIntercept);
    c_fetch.interceptors.response.use(AppState.responseIntercept);
    return c_fetch(newURL, newINIT);
  }
}


export default new AppState(_fetch)
