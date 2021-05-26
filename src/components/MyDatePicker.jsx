import React from 'react';
import { DatePicker } from 'antd'
import moment from 'moment';
import PropTypes from 'prop-types';


export default function MyDatePicker({ value, onChange, style, ...extra }) {
  return (<DatePicker
    style={style}
    value={value ? moment(value * 1000) : null}
    onChange={(moment) => {
      return onChange(moment ? moment.startOf('day').unix() : moment)
    }}
    {...extra}
  />)
}

MyDatePicker.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  style: PropTypes.object
}

MyDatePicker.defaultProps = {
  value: undefined,
  onChange: () => { },
  style: {
    width: 200
  }
}

