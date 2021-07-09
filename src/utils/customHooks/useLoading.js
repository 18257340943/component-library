import React, { useCallback, useState } from 'react';
import loadingPage from '@/components/loadingPage';


export function useLoading(req, startFn = () => { }, endFn = () => { }) {
  const [loading, setLoading] = useState(false);
  const wrapReq = useCallback((...args) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [loading, wrapReq];
}

export function useLoadingPage(req) {
  return useLoading(req, loadingPage.start, loadingPage.end)
}





