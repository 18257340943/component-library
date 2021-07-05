import { ButtonProps } from 'antd';


interface InitEnvConfig {
  notLoginUrl: string
  baseUrl: string
  mallUrl: string
  cookieName: string
  homePage: string
  domain: string,
  rentMallUrl: string
}

declare const initEnv: InitEnvConfig;

export default initEnv;


