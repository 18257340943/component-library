import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

function StaticSelect({ list, schema, value, onChange, placeholder, style, ...extra }) {
  return list.length > 0
    && (<Select value={value}
      style={style}
      allowClear
      placeholder={placeholder}
      onChange={onChange} {...extra} >
      {list.map(option => {
        return (<Option
          value={option[schema.value]}
          key={option[schema.key]}
        >{option[schema.label]}
        </Option>)
      })}
    </Select>);
}

export default StaticSelect;

StaticSelect.propTypes = {
  schema: PropTypes.object,
  list: PropTypes.array,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  style: PropTypes.object
}
StaticSelect.defaultProps = {
  schema: {
    value: 'value',
    key: 'value',
    label: 'label'
  },
  style: {
    width: 200
  },
  placeholder: "",
  list: [],
  value: undefined,
  onChange: () => { }
}



