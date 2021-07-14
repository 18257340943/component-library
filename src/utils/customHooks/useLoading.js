/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react';
import loadingPage from '@/components/loadingPage';


export function useLoading(req, deps = [], startFn = () => { }, endFn = () => { }) {
  const reqType = "function";
  if (typeof req !== reqType) {
    throw Error('useLoading接受参数必须是' + reqType);
  }
  const [loading, setLoading] = useState(false);
  const wrapReq = useCallback((...args) => {
    // console.log('请求开始了');
    setLoading(true);
    startFn();
    return req(...args).then((data) => {
      endFn()
      setLoading(false);
      return Promise.resolve(data);
    }).catch((reason) => {
      endFn()
      setLoading(false);
      return Promise.reject(reason);
    });
  }, deps);

  return { loading, wrapReq };
}

export function useLoadings(reqs = [], startFn = () => { }, endFn = () => { }) {
  const requests = [...reqs];
  const [loading, setLoading] = useState(false);

  return requests.map(request => {
    const reqType = "function";
    if (typeof request !== reqType) {
      throw Error('useLoadings接受参数必须是' + reqType);
    }
    console.log(loading, 'loading');
    return (...args) => {
      // console.log('请求开始了')
      setLoading(true);
      startFn();
      return request(...args)
        .then((data) => {
          endFn()
          setLoading(false);
          return Promise.resolve(data);
        }).catch((reason) => {
          endFn()
          setLoading(false);
          return Promise.reject(reason);
        });
    };
  });
}

export function useLoadingPage(req, deps) {
  return useLoading(req, deps, loadingPage.start, loadingPage.end)
}

export function useLoadingPages(reqs) {
  return useLoadings(reqs, loadingPage.start, loadingPage.end)
}









