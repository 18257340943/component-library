import React from 'react';

export default function ComImg({ src, ...extra }) {
  return (<img style={{ width: 50, height: 50 }} alt="" src={src} {...extra} />)
}