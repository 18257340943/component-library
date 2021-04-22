import React from 'react';
import { DatePicker } from 'antd'
import moment from 'moment';
import PropTypes from 'prop-types';


const { RangePicker } = DatePicker;

export default function MyRangePicker({
  value: valArr,
  onChange,
  type,
  format,
  style,
  ...extra }) {

  let result;
  switch (type) {
    case "timestamp":
      result = (<RangePicker
        value={valArr.map(value => (value ? moment(value * 1000) : null))}
        onChange={(momentArr) => {
          return onChange(momentArr ? momentArr.map(moment => moment.startOf('day').utc().unix()) : [null, null])
        }}
        {...extra}
      />)
      break;
    case "format":
      result = (<RangePicker
        value={valArr.map(value => (value ? moment(value) : null))}
        onChange={(momentArr) => {
          return onChange(momentArr ? momentArr.map(moment => moment.startOf('day').utc().format(format)) : [null, null])
        }}
        {...extra}
      />)
      break;
    default:
      break;
  }
  return result
}




MyRangePicker.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['timestamp', 'format']),
  style: PropTypes.object,
  format: PropTypes.string
}
MyRangePicker.defaultProps = {
  value: [null, null],
  onChange: () => { },
  styles: {
    width: 200
  },
  type: "timestamp",
  format: "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
}


