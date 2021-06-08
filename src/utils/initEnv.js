console.log(buildEnv, appName, 'buildEnv ,appName');
class InitEnv {
  constructor() {
    this.notLoginUrl = `http://${buildEnv === "online" ? "" : "pre-new-saas."}zxhj618.com/login`;
    this.baseUrl = `http://${buildEnv === "online" ? "" : "pre-"}main-service.zxhj618.com`;
    this.mallUrl = `http://${buildEnv === "online" ? "" : "pre-"}saas-mall.zxhj618.com`;
    this.cookieName = this.matchCookieName();
    this.domain = process.env.NODE_ENV === "production" ? "domain=zxhj618.com;" : "";
  }

  matchCookieName() {
    let result = [];
    switch (appName) {
      case "ZXHJ":
        result = `zxhj-${buildEnv === "online" ? "token" : "preToken"}`;
        break;
      case "SAAS":
        result = `${buildEnv === "online" ? "token" : "pre-token"}`;
        break;
      default:
        break;
    }
    return result;
  }
}

const initEnv = new InitEnv();

export default initEnv;
