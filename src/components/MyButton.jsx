import React, { useEffect } from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';

// import { Button  } from 'antd';

export default function MyButton({ title, type, onClick, children, ...extra }) {

  function confirm() {
    Modal.confirm({
      title,
      onOk: onClick,
      okText: "确认",
      cancelText: "取消"
    });
  }

  return (<Button
    type={type}
    onClick={confirm}
    {...extra}
    children={children} />)
}

MyButton.propTypes = {
  title: PropTypes.string,
  type: PropTypes.oneOf(['link', 'primary']),
  children: PropTypes.string,
  onClick: PropTypes.func,
}

MyButton.defaultProps = {
  title: "请填写标题",
  type: "link",
  children: "按钮",
  onClick: () => { }
}


