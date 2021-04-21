import React from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';


export default function MyButton({ title, onClick, children, ...extra }) {

  function confirm() {
    Modal.confirm({
      title,
      onOk: onClick,
      okText: "确认",
      cancelText: "取消"
    });
  }

  return (<>
    <Button type="link" onClick={confirm} {...extra}>{children}</Button>
  </>)
}
MyButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
}


