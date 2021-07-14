/* eslint-disable react/display-name */
import React from 'react';
import { makeStyles } from '@material-ui/styles';

export default function useContentWrapper() {
  const classes = makeStyles(theme => ({
    contentWrapper: {
      background: '#ffffff',
      padding: "16px 24px 16px 24px",
      minHeight: 'calc(100% - 37px )'
    }
  }))();

  return ({ children }) => (<div
    className={classes.contentWrapper}
    children={children}
  />);
}