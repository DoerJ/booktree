import React, { Component } from 'react';
import { render } from 'react-dom';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import { localStorageModel } from '../LocalStorage/localStorage';
import '../style/navigationBar.css';
import '../style/style.css'
/* global location */
/* eslint no-restricted-globals: ["off", "location"] */

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    console.log('UID: ' + this.props.uid);
    this.state = {
      mode: this.props.mode,
      homeFlag: false,
      publishFlag: false,
      buyerFlag: false,
      meFlag: false,
      uid: this.props.uid,
      newBuyerCounts: 0
    };
  }
  componentWillMount = () => {
    let newBuyerCounts = localStorageModel.fetchItemFromLocal('BUYERS_COUNTS_DIFF');
    this.setState({
      newBuyerCounts: parseInt(newBuyerCounts)
    });
  }
  componentDidMount = () => {
    switch (this.state.mode) {
      case 'home':
        this.setState({
          homeFlag: true
        });
        break;
      case 'publish':
        this.setState({
          publishFlag: true
        });
        break;
      case 'buyer':
        this.setState({
          buyerFlag: true
        });
        break;
      case 'me':
        this.setState({
          meFlag: true
        });
        break;
    }
  }
  // home page link
  backToHomePage() {
    console.log('Back to homepage');
    let uid = this.state.uid;
    location.hash = `default_index_list/${uid}/search=null`;
  }
  // new book publish
  bookPublish() {
    console.log('Enter publish page!');
    let uid = this.state.uid;
    location.hash = `/book_publish/${uid}`;
  }
  // display my buyers
  displayMyBuyers() {
    console.log('Enter buyer page!');
    let uid = this.state.uid;
    location.hash = `/my_buyers/${uid}`;
  }
  // Me info
  aboutMe() {
    console.log('Enter me page!');
    let uid = this.state.uid;
    location.hash = `/me/${uid}`;
  }
  render() {
    return(
      <div>
        <span className="nav-item-container">
          <a className={this.state.homeFlag ? "active-nav-item" : "nav-item"} onClick={() => {this.backToHomePage()}}>Home</a>
        </span>
        <span className="nav-item-container">
          <a className={this.state.publishFlag ? "active-nav-item" : "nav-item"} onClick={() => {this.bookPublish()}}>Publish</a>
        </span>
        <div className="nav-item-container" style={{display:'inline-block'}}>
          <NotificationBadge count={this.state.newBuyerCounts} effect={Effect.SCALE} style={{marginTop:'0'}}/>
          <a className={this.state.buyerFlag ? "active-nav-item" : "nav-item"} onClick={() => {this.displayMyBuyers()}}>Buyers</a>
        </div>
        <span className="nav-item-container">
          <a className={this.state.meFlag ? "active-nav-item" : "nav-item"} onClick={() => {this.aboutMe()}}>Me</a>
        </span>
      </div>
    );
  }
}

export default NavigationBar;
