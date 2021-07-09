import React, { useEffect } from "react";


export default function useUnMount(callback) {
  useEffect(() => {
    return () => {
      callback && callback();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}