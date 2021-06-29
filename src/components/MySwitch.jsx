import React, { } from 'react';
import { makeStyles } from "@material-ui/styles";


export default function MySwitch({ label, value, onChange }) {

  const classes = makeStyles((theme) => ({
    topWrapper: {
      padding: theme.wrapperPd.common,
      backgroundColor: '#ffffff'
    },
    switchBox: {
      marginLeft: 16,
      marginBottom: 10,
    },
    label: {
      paddingLeft: 8,
      paddingRight: 8
    }
  }))();

  return (<div className={classes.switchBox}>
    {/* <Switch checked={value === }
      onChange={value => { } /> */}
    <span className={classes.label}>{label}</span>
  </div>)
}