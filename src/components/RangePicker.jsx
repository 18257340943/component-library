import React from 'react';
import { DatePicker } from 'antd'
import moment from 'moment';

const { RangePicker } = DatePicker;

export default function MyRangePicker({ value, onChange, dateFormat, ...extra }) {

  return (<RangePicker
    defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
    format={dateFormat}
  />)
}

