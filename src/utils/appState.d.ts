interface FetchConfig {
  body?: object;
  headers?: object;
  search?: object;
  method?: 'GET' | 'POST' | "PUT" | "DELETE" | "PATCH";
}
interface ResultFormat {
  code: number;
  data: unknown;
}
export declare type AppStateProps = {
  fetch: (url: string, init: FetchConfig) => Promise<ResultFormat>;
}

declare const appState: AppStateProps;
export default appState;
