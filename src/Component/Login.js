import React, { Component } from 'react';
import { render } from 'react-dom';
import { userModel, cloudMessageModel } from '../DataModel/dataModel';
import { localStorageModel } from '../LocalStorage/localStorage';
import '../style/style.css';
import '../style/login.css'

/* global location */
/* eslint no-restricted-globals: ["off", "location"] */
let services = require('../Database/firebase');
let firebase = services.firebase;
let messaging = firebase.messaging();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
       inputEmailValue: '',
       inputPasswordValue:'',
       fieldActive: false
     };
     this.updateEmailInputValue = this.updateEmailInputValue.bind(this);
     this.updatePasswordInputValue = this.updatePasswordInputValue.bind(this);
  }
  // handle user login
  loginWithFirebaseAccount() {
    console.log('login successes!');
    // send login post to firebase
    let email = this.refs.email.value;
    let password = this.refs.password.value;
    //console.log('email: ' + email);
    let userLoginInfo = {
      email: email,
      password: password
    };
    userModel.login(userLoginInfo, (success) => {
      // if login successful
      let code = success.code;
      if(code === 300) {
        var message = success.message;
        var uid = success.uid;
        // without '@'
        var topic = success.email;
        var buyerCountDiff = success.buyerDiffCounts;
        console.log('BUYER COUNTS: ' + buyerCountDiff);
        localStorageModel.storeItemToLocal('BUYERS_COUNTS_DIFF', buyerCountDiff);
        //alert(message);
        //console.log('uid: ' + uid);
        // get registration token
        messaging.requestPermission().then(function() {
          console.log('Notification permission granted.');
          location.hash = `/default_index_list/uid_${uid}/search=null`;
          return messaging.getToken();
        }).then(function(token) {
          console.log('Registration token: ' + token);
          // save in local storage
          localStorageModel.storeItemToLocal('TOPIC', `${topic}__${token}`);
          // subscribe to topic
          let subscribeInfo = {
            token: token,
            topic: topic
          };
          cloudMessageModel.subscribeToTopic(subscribeInfo, (success) => {
            let code = success.code;
            let message = success.message;
            if(code === 300) {
              console.log(message);
            }
          }, (error) => {
            console.log(error);
          });
        }).catch(function(err) {
          console.log('Unable to get permission to notify.', err);
        });
      }
      else if(code === 301) {
        var message = success.message;
        alert(message);
      }
    }, (error) => {
      // if err
    });
    //
  }
  // back to welcome page
  backToWelcomePageFromLogIn() {
    location.hash = '/';
  }
  // handle password reset
  handlePasswordReset() {
    console.log('reset password');
    // check if user has filled in email addr
    let email = this.refs.email.value;
    if(email === '') {
      alert('To reset password, please fill in your email address.');
      return;
    }
    let resetInfo = {
      email: email
    };
    userModel.resetPassword(resetInfo, (success) => {
      // reset password successful
      let code = success.code;
      if(code === 300) {
        var message = success.message;
        alert(message);
      }
    }, (error) => {
      // if error
      console.log(error);
    });
  }
// to update the changes in the input and activate it
  updateEmailInputValue(e) {
    this.setState({
      inputEmailValue: e.target.value,
    });
    e.preventDefault();
  }
  updatePasswordInputValue(e) {
    this.setState({
      inputPasswordValue: e.target.value,
    });
    e.preventDefault();
  }
  render() {
    return(
      <div className="login-item-container">
        <div className="item-content">
          <div className="left-logo-container">
            <div className="web-logo" onClick={() => {this.backToWelcomePageFromLogIn()}}></div>
          </div>
          <div></div>
          <div className="login-web-title-container">
            <div className="login-web-title">
              <span>L o g&nbsp;&nbsp;I n</span>
            </div>
            <div className="login-web-sub-title">
              <span>Get on the booktree from here . . .</span>
            </div>
          </div>
        </div>
        <div className="login-content-conainer">
          <div></div>
          <div>
            <div className="typing-field-container-top">
              <span className={this.state.inputEmailValue ? "field-active" : ""}>Email</span>
              <input className="login-typing-field-input" type="text" value={this.state.inputEmailValue} onChange={this.updateEmailInputValue} placeholder="Email" ref='email'/>
            </div>
            <div className="typing-field-container-bottom">
              <span className={this.state.inputPasswordValue ? "field-active" : ""}>Password</span>
              <input className="login-typing-field-input" type="password" value={this.state.inputPasswordValue} onChange={this.updatePasswordInputValue} placeholder="Password" ref="password"/>
              <div className="password-forget-prompt">
                <div className="resetPassword" onClick={() => {this.handlePasswordReset()}}>Forget password?</div>
              </div>
            </div>
            <div className="submit-field-container">
              <div className="submit" onClick={() => {this.loginWithFirebaseAccount()}}>Go</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
