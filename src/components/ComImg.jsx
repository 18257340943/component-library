import React from 'react';
import PropTypes from 'prop-types';


export default function ComImg({ src, style, ...extra }) {
  return (<img style={style} alt="" src={src} {...extra} />)
}


ComImg.propTypes = {
  src: PropTypes.string,
  style: PropTypes.object
}

ComImg.defaultProps = {
  style: {
    width: 50,
    height: 50
  }
}


