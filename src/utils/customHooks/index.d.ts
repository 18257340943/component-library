import React from "react";

interface ReturnLoading<F> {
  loading: boolean,
  wrapReq: F
}
declare function useLoadings<A, S, E>(reqs: A, startFn: S, endFn: E): A;

declare function useLoadingPages<A>(reqs: A): A;

declare function useDebounce<F>(fn: F, delay: number, dep: any[] = []): F;

declare function useLoading<F, D, S, E>(req: F, deps: D, startFn: S, endFn: E): ReturnLoading<F>;

declare function useLoadingPage<F, D>(req: F, deps: D): ReturnLoading<F>;

declare function useContentWrapper(): React.FC;

interface CustomHooks {
  useLoadings: typeof useLoadings;
  useLoadingPages: typeof useLoadingPages;
  useLoading: typeof useLoading;
  useLoadingPage: typeof useLoadingPage;
  useDebounce: typeof useDebounce;
  useMount: () => {};
  useUnMount: () => {};
  useContentWrapper: typeof useContentWrapper;
}


declare const customHooks: CustomHooks;
export default customHooks;




