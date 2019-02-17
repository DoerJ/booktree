import React, { Component } from 'react';
import { render } from 'react-dom';
import Notifications, { notify } from 'react-notify-toast';
import { userModel } from '../DataModel/dataModel';
import '../style/style.css';
import '../style/register.css'

/* global location */
/* eslint no-restricted-globals: ["off", "location"] */

// input field style

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputEmailValue:'',
      inputPasswordValue:'',
      inputUserNameValue:'',
      inputConfirmPasswordValue:''
    };
    this.updateEmailInputValue = this.updateEmailInputValue.bind(this);
    this.updatePasswordInputValue = this.updatePasswordInputValue.bind(this);
    this.updateUserNameValue = this.updateUserNameValue.bind(this);
    this.updateConfrimPasswordValue = this.updateConfrimPasswordValue.bind(this);
  }

  // handle user registration
  createFirebaseUserAccount() {
    //console.log('account created!');
    // input value
    let email = this.refs.email.value;
    let username = this.refs.username.value;
    let password = this.refs.password.value;
    let passwordConfirm = this.refs.password_confirm.value;

    if(email === '') {
      alert('Please enter your email address.');
      return;
    }
    else if(username === '') {
      alert('Please enter your username.');
      return;
    }
    else if(password === '') {
      alert('Please enter your password.');
      return;
    }
    else if(password !== passwordConfirm) {
      alert('Please retry to match your password.');
      return;
    }

    let userRegisterInfo = {
      email: email,
      username: username,
      password: password,
      passwordConfirm: passwordConfirm
    }
    // put userRegisterInfo into request
    userModel.register(userRegisterInfo, (success) => {
      // if res successful
      let code = success.code;
      if(code === 200) {
        var message = success.message;
        alert(message);
        location.hash = '/log_in';
      }
      // invalid registration info
      else if(code === 301) {
        alert(success.errMessage);
        return;
      }
    }, (error) => {
      // if error in res
    });
    // send post to firebase server
  }
  // back to welcome page
  backToWelcomePageFromRegistration() {
    location.hash = '/';
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
  updateUserNameValue(e) {
    this.setState({
      inputUserNameValue: e.target.value,
    });
    e.preventDefault();
  }
  updateConfrimPasswordValue(e) {
    this.setState({
      inputConfirmPasswordValue: e.target.value,
    });
    e.preventDefault();
  }

  render() {
    return(
      <div className = "register-item-container">
        <div className="input-item-container">
          <div className="left-logo-container">
            <div className="web-logo" onClick={() => {this.backToWelcomePageFromRegistration()}}></div>
          </div>
          <div className="inputContainer">
            <div className="register-typing-container">
              <div className={this.state.inputEmailValue ? "field-active" : ""}>Email</div>
              <input className="register-typing-field-input" type="text" ref="email" value={this.state.inputEmailValue} onChange={this.updateEmailInputValue} placeholder="Email"/>
            </div>
            <div className="register-typing-container">
              <div className={this.state.inputUserNameValue ? "field-active" : ""}>Username</div>
              <input className="register-typing-field-input" type="text" ref="username" value={this.state.inputUserNameValue} onChange={this.updateUserNameValue} placeholder="Username"/>
            </div>
            <div className="register-typing-container">
              <div className={this.state.inputPasswordValue ? "field-active" : ""}>Password</div>
              <input className="register-typing-field-input" type="password" ref="password" value={this.state.inputPasswordValue} onChange={this.updatePasswordInputValue} placeholder="Password"/>
            </div>
            <div className="register-typing-container">
              <div className={this.state.inputConfirmPasswordValue ? "field-active" : ""}>Password Confirm</div>
              <input className="register-typing-field-input" type="password" ref="password_confirm" value={this.state.inputConfirmPasswordValue} onChange={this.updateConfrimPasswordValue} placeholder="Password Confirm"/>
            </div>
            <div className="register-submit-field-container">
              <div className="submit-button" onClick={() => {this.createFirebaseUserAccount()}}>C r e a t e</div>
            </div>
          </div>
        </div>
        <div className='register-title-container'>
          <div className="register-title">S i g n&nbsp;&nbsp;U p</div>
          <div className="register-sub-title">
            <span>Easy to set up an account</span>
            <span>and start your journay from here . . .</span>

          </div>

        </div>
      </div>

    );
  }
}

export default Register;
