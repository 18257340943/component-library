import React from 'react';
import { DatePicker } from 'antd'
import moment from 'moment';
// moment.locale('zh-cn');


export default function MyDatePicker({ value, onChange, ...extra }) {
  return (<DatePicker
    value={value ? moment(value * 1000) : null}
    onChange={(moment) => {
      return onChange(moment ? moment.startOf('day').unix() : moment)
    }}
    {...extra}
  />)
}