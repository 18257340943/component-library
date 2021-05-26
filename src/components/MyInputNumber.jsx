import React from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';


const limitDecimals = (value) => {
  const reg = /^(\-)*(\d+)\.(\d\d).*$/;
  if (typeof value === 'string') {
    return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
  } else {
    return ''
  }
};

export default function MyInputNumber({ value, onChange, style, ...extra }) {
  return (<InputNumber min={0} className="myInputNumber"
    style={style}
    formatter={limitDecimals} parser={limitDecimals}
    value={value} onChange={onChange}
    {...extra}
  />)
}

MyInputNumber.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  style: PropTypes.object
}

MyInputNumber.defaultProps = {
  style: {
    width: 200
  }
}

