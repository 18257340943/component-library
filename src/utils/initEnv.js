
// const buildEnv = buildEnv;
// const appName = appName;


class InitEnv {

  constructor() {
    this.baseUrl = `http://${buildEnv === "online" ? '' : 'pre-'}main-service.zxhj618.com`;
    this.cookieName = this.matchCookieName();
    this.domain = process.env.NODE_ENV === 'production' ? 'domain=zxhj618.com;' : '';
  }

  matchCookieName() {
    let result = [];
    switch (appName) {
      case 'ZXHJ':
        result = `zxhj-${buildEnv === "online" ? 'token' : 'preToken'}`;
        break;
      case 'SAAS':
        result = `${buildEnv === "online" ? 'token' : 'pre-token'}`;
        break;
      default:
        break;
    }
    return result
  }

}

const initEnv = new InitEnv();

export default initEnv;
