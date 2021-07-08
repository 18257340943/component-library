import React, { useCallback, useState } from 'react';
import loadingPage from '@/components/loadingPage';

export default function useLoading(req) {
  const [loading, setLoading] = useState(false);
  const wrapReq = useCallback(
    (...args) => {
      setLoading(true);
      loadingPage.start();
      return req(...args).then((data) => {
        loadingPage.end();
        setLoading(false);
        return Promise.resolve(data);
      }).catch((reason) => {
        loadingPage.end()
        setLoading(false);
        return Promise.reject(reason);
      });
    },
    [req]
  );
  return [loading, wrapReq];
}