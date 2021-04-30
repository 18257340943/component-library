import LocalStorge from './LocalStoage';
import { message } from 'antd';
import { search, removeEmptyField } from './utils'

const _fetch = function () {
  //定义用来存储拦截请求和拦截响应结果的处理函数集合
  let interceptors_req = [], interceptors_res = [];

  function c_fetch(input, init = {}) {
    //fetch默认请求方式设为GET
    if (!init.method) {
      init.method = 'POST'
    }
    //interceptors_req是拦截请求的拦截处理函数集合
    interceptors_req.forEach(interceptors => {
      init = interceptors(init);
    });
    // console.log(input, 'input')  
    //在原生fetch外面封装一个promise，为了在promise里面可以对fetch请求的结果做拦截处理。
    //同时，保证c_fetch函数返回的结果是个promise对象。

    // console.log(input, init, 'input, init')
    return new Promise(function (resolve, reject) {
      //发起fetch请求，fetch请求的形参是接收上层函数的形参
      fetch(input, init).then(res => {
        //interceptors_res是拦截响应结果的拦截处理函数集合
        interceptors_res.forEach(interceptors => {
          //拦截器对响应结果做  处理，把处理后的结果返回给响应结果。
          res = interceptors(res);
        });
        const responseHeaders = res.headers;
        const responseContentType = responseHeaders.get("Content-Type");
        if (responseContentType === "application/vnd.ms-excel;charset=UTF-8") {
          return res.blob().then(blob => {
            let url = window.URL.createObjectURL(blob);
            let disposition = res.headers.get('Content-Disposition');
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
          })
        } else {
          return res.json();
        }
      }).then(result => {
        // console.log(result, 'result')
        const { data } = result;
        if (result.code !== 200) {
          message.error(data.message || '服务器异常！');
          return;
        };
        //将拦截器处理后的响应结果resolve出去
        resolve(data);
      }).catch(err => {
        reject(err);
      })
    })
  }

  //在c_fetch函数上面增加拦截器interceptors，拦截器提供request和response两种拦截器功能。
  //可以通过request和response的use方法来绑定两种拦截器的处理函数。
  //use方法接收一个参数，参数为一个callback函数，callback函数用来作为拦截器的处理函数；
  //request.use方法会把callback放在interceptors_req中，等待执行。
  //response.use方法会把callback放在interceptors_res中，等待执行。
  //拦截器的处理函数callback接收一个参数。
  //request拦截器的callback接收的是请求发起前的config；
  //response拦截器的callback接收的是网络请求的response结果。
  c_fetch.interceptors = {
    request: {
      use: function (callback) {
        interceptors_req.push(callback);
      }
    },
    response: {
      use: function (callback) {
        interceptors_res.push(callback);
      }
    }
  }

  return c_fetch
}

function sleep(sleepTime) {
  console.log('程序睡眠' + sleepTime + 'ms')
  for (var start = new Date; new Date - start <= sleepTime;) { }
}



class AppState {

  constructor(_fetch) {
    // console.log(buildEnv, 'buildEnv');
    this.baseUrl = buildEnv === "online" ? 'http://main-service.zxhj618.com' : 'http://pre-main-service.zxhj618.com';
    this._fetch = _fetch;
  }

  // 支持 search 参数url化
  addSearch(url, init) {
    init && Object.keys(init).forEach(key => {
      if (key === 'search') {
        let searchObj = init[key];
        if (!searchObj) {
          throw Error('类型', 'search对象传入值不能为null等')
        };
        searchObj = removeEmptyField(searchObj);
        const searchUrl = search(searchObj);
        url = url + searchUrl;
        delete init[key]
      }
    });
    return {
      newURL: url,
      newINIT: init
    }
  }

  // 针对请求路径和配置做进一步处理啊
  updateParams(url, init) {
    // console.log(init, 'init')
    url = this.baseUrl + url;
    // init = removeEmptyField(init);
    let { newURL, newINIT } = this.addSearch(url, init);
    // console.log(newURL, 'newURL')
    return { newURL, newINIT };
  }

  requestIntercept(config) {
    // console.log(config, 'config')
    const zxhj_userInfo = LocalStorge.getItem('zxhj_userInfo');
    let { headers, body } = config;
    let defaultHeaders;

    defaultHeaders = new Headers({
      'Content-Type': 'application/json',   // 默认上传类型
      ...headers
    });

    if (body) {
      if (body.__proto__.constructor.name === "FormData") {
        defaultHeaders.delete('Content-Type');
      } else {
        body = JSON.stringify(removeEmptyField(body));
      }
    }

    // 请求前拦截，用户登录情况下写入请求头token
    if (zxhj_userInfo) {
      const userToken = JSON.parse(zxhj_userInfo).token;
      defaultHeaders.append('Authorization', `Bearer ${userToken}`)
    };

    return {
      ...config,
      headers: defaultHeaders,
      body
    }

  }

  responseIntercept(response) {
    return response
  }

  fetch(url, init) {
    const c_fetch = this._fetch();
    const { newURL, newINIT } = this.updateParams(url, init);
    // console.log(newURL, 'newUrl')
    c_fetch.interceptors.request.use(this.requestIntercept);
    c_fetch.interceptors.response.use(this.responseIntercept);
    return c_fetch(newURL, newINIT)
  }

}


export default new AppState(_fetch);


