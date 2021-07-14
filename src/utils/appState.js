/* eslint-disable camelcase */  // 允许使用_下划线命名形式

import { message } from "antd";

import cookie from "./cookie";
import { search, removeEmptyField } from "./utils";
import initEnv from "./initEnv";

const { getCookie } = cookie;
const { baseUrl } = initEnv;

// 支持 search 参数url化,并且将 search 参数删除
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

// 为baseUrl 添加 pathUrl
function addPathUrl(baseUrl, url) {
  let newURL = '';
  if (typeof url === "string") {
    newURL = baseUrl + url;
    return newURL;
  }

}

// 部分业务支持重写 url
function initUrl(url, init) {
  let newURL = url;
  if (Object.hasOwnProperty.call(init, 'initUrl')) {
    newURL = init.initUrl
    return newURL
  }
  return newURL
}

// 带有请求拦截器的 fetch
const _fetch = () => {
  // 定义用来存储拦截请求和拦截响应结果的处理函数集合
  let interceptors_req = [];
  let interceptors_res = [];

  function c_fetch(input, init = {}) {

    // fetch默认请求方式设为GET
    if (!init.method) {
      init.method = "POST";
    }
    // interceptors_req是拦截请求的拦截处理函数集合
    interceptors_req.forEach(interceptors => {
      init = interceptors(init);
    });
    interceptors_req = [];
    return new Promise((resolve, reject) => {
      // 发起fetch请求，fetch请求的形参是接收上层函数的形参
      fetch(input, init)
        .then(res => {
          interceptors_res.forEach(interceptors => {
            // 拦截器对响应结果做  处理，把处理后的结果返回给响应结果。
            res = interceptors(res);
          });
          interceptors_res = [];
          // 常规数据返回 res.json()
          if (Object.getPrototypeOf(res).constructor.name === "Response") {
            return res.json();
          }
          resolve(res);
        })
        .then(result => {
          const { data, code } = result;
          // 通过 code === 200? 认证直接报错
          if (code !== 200) {
            const errorMsg = data && data.message || "服务器异常！";
            message.error(errorMsg);
            reject(errorMsg);
            return;
          }
          // 部分接口通过data中的 succeed? 判断
          if (data.succeed === 0) {
            message.error(data && data.msg || "服务器异常！");
            return;
          }
          // 将拦截器处理后的响应结果resolve出去
          resolve(data);
        })
        .catch(err => reject(err));
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

  constructor() {
    this.minTime = 100;
    this._fetch = _fetch();
    this.baseUrl = baseUrl;
  }

  // 私有属性代表appState 默认拦截处理
  #requestIntercept = (config) => {
    let { body } = config;
    let { headers } = config;
    // console.log(headers, 'headers');
    const loginToken = getCookie(initEnv.cookieName);
    headers = removeEmptyField(headers);

    const defaultHeaders = new Headers({
      "Content-Type": "application/json", // 默认上传类型
      ...headers,
    });

    // console.log(defaultHeaders.get('projectId'));
    // form-data数据类型 更改 content-type 类型为自适应
    if (body) {
      if (Object.getPrototypeOf(body).constructor.name === "FormData") {
        defaultHeaders.delete("Content-Type");
      } else {
        body = typeof body === "object" ? JSON.stringify(removeEmptyField(body)) : body;
      }
    }

    // 请求前拦截，用户登录情况下写入请求头token
    if (loginToken && loginToken !== "undefined") {
      defaultHeaders.append("Authorization", `Bearer ${loginToken}`);
    }

    return {
      ...config,
      headers: defaultHeaders,
      body,
    };
  }

  #responseIntercept = (response) => {

    // OSS 签名认证特殊处理
    const ossUrl = "http://cdn-oss-data-zxhj.oss-cn-zhangjiakou.aliyuncs.com/";
    // 批量导出 contentType为ms-excel类型
    const isXls = response.headers.get('content-type') && response.headers.get('content-type').indexOf("application/vnd.ms-excel") > -1;
    if (response.url === ossUrl && response.status === 200) {
      return { code: 200 };
      // 确认返回类型是 xls 表格系列
    } else if (isXls) {
      return response.blob().then(blob => {
        let url = window.URL.createObjectURL(blob);
        let disposition = response.headers.get('Content-Disposition');
        let filename = disposition ? disposition.split("=")[1] : '';
        if (filename) {
          filename = decodeURIComponent(filename);
        }
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        return { code: 200, data: true };
      });
    } else {
      return response
    }

  }

  // 针对请求路径和配置做进一步处理啊
  updateUrl(url, init) {
    url = addPathUrl(this.baseUrl, url);
    url = initUrl(url, init);
    const { newURL, newINIT } = addSearch(url, init);
    return { newURL, newINIT };
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
          resolve({ link });
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
    // 在请求之前针对url进行初始化处理；
    let { newURL, newINIT } = this.updateUrl(url, init);
    // 内部默认拦截器
    this._fetch.interceptors.request.use(this.#requestIntercept);
    this._fetch.interceptors.response.use(this.#responseIntercept);

    return this._fetch(newURL, newINIT);
  }

}

const appState = new AppState();

export default appState;

