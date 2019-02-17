import React, { Component } from 'react';
import { render } from 'react-dom';
import '../style/MainEntry.css';
import '../style/style.css';

/* global location */
/* eslint no-restricted-globals: ["off", "location"] */

class MainEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // redirect to user login
  userLogIn() {
    //console.log('login clicked!');
    location.hash = '/log_in';
  }

  // redirect to user reg
  userRegister() {
    location.hash='/register';
  }

  render() {
    return(
      <div className="item-container">
        <div className="user-container">
          <div className="left-logo-container">
            <div className="web-logo"></div>
          </div>
          <div></div>
          <div className="web-title-container">
            <div className="web-title">
              <span>B o o k T r e e</span>
            </div>
            <div className="web-sub-title">
              <span>A place where you pass your books to others,</span>
              <span>and find your books through others . . .</span>
            </div>
          </div>
          <div className="button-container">
            <div className="login-button-container" onClick={() => {this.userLogIn()}}>
              <a>L&nbsp;o&nbsp;g&nbsp;&nbsp;&nbsp;I&nbsp;n</a>
            </div>
            <div></div>
            <div className="signup-button-container"  onClick={() => {this.userRegister()}}>
              <a>S&nbsp;i&nbsp;g&nbsp;n&nbsp;&nbsp;&nbsp;U&nbsp;p</a>
            </div>
          </div>
        </div>
        <div className="background-container">
           <div className="background-image"></div>
        </div>

      </div>
    );
  }
}

export default MainEntry;
