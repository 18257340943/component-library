import React from 'react';
import { Spin } from 'antd';


export default function LoadingPage({ display }) {

  display = display || 'none';

  return (<div style={{
    display: display,
    width: "100vw",
    height: '100vh',
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, .5)'
  }}>
    <Spin style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50% , -50%)',
    }} />
  </div >)

}