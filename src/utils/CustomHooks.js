import React, { useEffect } from "react";
import useStyles from '@/pages/home/components/styles';

export function useMount(callback) {
  useEffect(() => {
    callback && callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useUnMount(callback) {
  useEffect(() => {
    return () => {
      callback && callback();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useContentWrapper() {
  const classes = useStyles();
  return ({ children }) => (<div className={classes.root} children={children} />)
}


