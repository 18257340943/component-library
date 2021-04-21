import React, { useState, Component } from 'react';
import './change_button.css';

class ChangeButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnTxt: 'Login'
    }
  }

  render() {
    console.log(333)
    const { btnTxt } = this.state;
    return (
      <div className='button-container' onClick={() => { this.setState({ btnTxt: btnTxt === 'Login' ? 'Logout' : 'Login' }) }}>
        <span>{btnTxt}</span>
      </div>
    )
  }
}

export default ChangeButton;