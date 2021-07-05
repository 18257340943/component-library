import React from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';


export default function StaticTabs({ list, value, onChange, ...extra }) {
  return (
    <Tabs
      activeKey={String(value)}
      onChange={onChange}
      {...extra}
    >
      {list.map(tab => (<Tabs.TabPane tab={tab.label} key={tab.value} />))}
    </Tabs>);
}

StaticTabs.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
}
StaticTabs.defaultProps = {
  value: '',
}
