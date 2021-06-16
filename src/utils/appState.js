import { message } from "antd";

import { getCookie } from "./cookie";
import { search, removeEmptyField } from "./utils";
import initEnv from "./initEnv";

// 支持 search 参数url化
function addSearch(url, init) {
  // console.log(url, JSON.stringify(init), 'url')
  // eslint-disable-next-line no-unused-expressions
  init &&
    Object.keys(init).forEach(key => {
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
    interceptors_req.forEach(interceptors => {
      init = interceptors(init);
    });

    // 在原生fetch外面封装一个promise，为了在promise里面可以对fetch请求的结果做拦截处理。
    // 同时，保证c_fetch函数返回的结果是个promise对象。

    // console.log(input, init, 'input, init')
    return new Promise((resolve, reject) => {
      // 发起fetch请求，fetch请求的形参是接收上层函数的形参
      fetch(input, init)
        .then(res => {
          // interceptors_res是拦截响应结果的拦截处理函数集合
          interceptors_res.forEach(interceptors => {
            // console.log(interceptors, 'interceptors');
            // 拦截器对响应结果做  处理，把处理后的结果返回给响应结果。
            res = interceptors(res);
          });
          const ossUrl = "http://cdn-oss-data-zxhj.oss-cn-zhangjiakou.aliyuncs.com/";
          if (res.url === ossUrl && res.status === 200) {
            return new Promise((resolve, reject) => { resolve({ code: 200 }) });
          } else {
            return res.json();
          }
        })
        .then(result => {
          // console.log(result, 'result')
          const { data } = result;
          if (result.code !== 200) {
            message.error(data && data.message || "服务器异常！");
            return;
          }
          // 将拦截器处理后的响应结果resolve出去
          resolve(data);
        })
        .catch(err => {
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
    // console.log('fetch测试开始了');
    this._fetch = fetch;
    this.baseUrl = initEnv.baseUrl;
    // console.log(AppState.loginToken, 'AppState.loginToken')
  }

  // 针对请求路径和配置做进一步处理啊
  updateParams(url, init) {
    url = this.baseUrl + url;
    const { newURL, newINIT } = addSearch(url, init);
    return { newURL, newINIT };
  }

  static loginToken = getCookie(initEnv.cookieName);

  static requestIntercept(config) {
    let { body } = config;
    let { headers } = config;
    headers = removeEmptyField(headers);

    const defaultHeaders = new Headers({
      "Content-Type": "application/json", // 默认上传类型
      ...headers,
    });

    if (body) {
      if (Object.getPrototypeOf(body).constructor.name === "FormData") {
        defaultHeaders.delete("Content-Type");
      } else {
        body = typeof body === "object" ? JSON.stringify(removeEmptyField(body)) : body;
      }
    }

    // 请求前拦截，用户登录情况下写入请求头token
    if (AppState.loginToken && AppState.loginToken !== "undefined") {
      defaultHeaders.append("Authorization", `Bearer ${AppState.loginToken}`);
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

  getOSS() {
    return this.fetch('/upload/uploadPolicy', {
      method: "GET"
    })
  }

  // 新增文件上传通用服务
  uploadFile(info = {}) {
    const { file } = info;
    const { size, name } = file;
    const unOssFileMaxSize = 5 * 1024 * 1024;   // 精确到字节 默认最大 5MB
    return new Promise((resolve) => {
      if (size < unOssFileMaxSize) {
        const formData = new FormData();
        formData.append('file', info.file);
        this.fetch('/upload', {
          body: formData,
        }).then(data => {
          const { link } = data;
          resolve(link);
        })
      } else {
        this.getOSS().then(data => {
          const { accessid, cdnPath, dir, host, policy, signature } = data;
          const ossFormData = new FormData();
          ossFormData.append('key', `${dir}${name}`); //存储在oss的文件路径
          ossFormData.append('policy', policy); //policy
          ossFormData.append('OSSAccessKeyId', accessid); //accessKeyId
          ossFormData.append('success_action_status', "200"); //成功后返回的操作码
          ossFormData.append('signature', signature); //签名
          ossFormData.append("file", file);
          this.fetch(host, {
            initUrl: host,
            method: 'POST',
            body: ossFormData
          }).then(data => {
            resolve({
              link: cdnPath + name
            })
          })

        })

      }


    })


  }

  fetch(url, init) {
    const c_fetch = this._fetch();
    let { newURL, newINIT } = this.updateParams(url, init);
    // fetch请求可通过 init配置覆盖url
    const { initUrl } = newINIT;
    if (initUrl) {
      newURL = initUrl;
    }
    // console.log(newURL, 'newURL');
    // console.log(newURL, 'newUrl')
    c_fetch.interceptors.request.use(AppState.requestIntercept);
    c_fetch.interceptors.response.use(AppState.responseIntercept);
    return c_fetch(newURL, newINIT);
  }
}

export default new AppState(_fetch);
