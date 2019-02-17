import React, { Component } from 'react';
import { render } from 'react-dom';
import { userModel, bookModel, cloudMessageModel } from '../DataModel/dataModel';
import { localStorageModel } from '../LocalStorage/localStorage';
import NavigationBar from './NavigationBar';
import '../style/style.css';
import '../style/Me.css';

/* global location */
/* eslint no-restricted-globals: ["off", "location"] */

class Me extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.match.params.uid,
      username: '',
      list: [],
      pendingList: [],
      myPendingBookFlag: false
    };
  }
  componentDidMount = () => {
    console.log('Render aboutMe list.');
    // get username in log-out-prompt
    this.fetchUsername();
    this.fetchMyBookList();
  }
  // fetch username
  fetchUsername = () => {
    console.log('UID: ' + this.state.uid.substr(4));
    userModel.fetchUsername({uid: this.state.uid.substr(4)}, (success) => {
      var code = success.code;
      if(code === 300) {
        this.setState({
          username: success.username
        });
      }
    }, (error) => {
      console.log(error);
    });
  }
  // fetch myBook list
  fetchMyBookList = () => {
    var me_id = this.state.uid.substr(4);
    var meInfo = {
      me_id: me_id
    }
    bookModel.fetchMyBookList(meInfo, (success) => {
      // if fetch successful
      var code = success.code;
      if(code === 300) {
        this.setState({
          list: success.list
        });
      }
    }, (error) => {
      // if error
      console.log(error);
    });
  }
  // fetch pending book list
  fetchMyPendingBookList = () => {
    var me_id = this.state.uid.substr(4);
    var meInfo = {
      me_id: me_id
    }
    bookModel.fetchMyPendingBookList(meInfo, (success) => {
      console.log('Change book list.');
      let code =  success.code;
      let list = success.list;
      if(code === 300) {
        this.setState({
          pendingList: list
        });
      }
      console.log(this.state.pendingList);
    }, (error) => {
      console.log(error);
    })
  }
  // logout the firebase account
  logoutFirebaseAccount(e) {
    console.log('Log out!');
    e.stopPropagation();
    if(confirm('Log out?')) {
      let logoutInfo = {
        uid: this.state.uid.substr(4)
      }
      // handle logout
      userModel.logout(logoutInfo, (success) => {
        // if signout successful
        let code = success.code;
        if(code === 400) {
          var message = success.message;
          alert(message);
          location.hash = '/log_in';
          // fetch topic
          let topicToken = localStorageModel.fetchItemFromLocal('TOPIC');
          let topic = topicToken.split('__')[0];
          let registrationToken = topicToken.split('__')[1];
          let unsubscribeInfo = {
            topic: topic,
            registrationToken: registrationToken
          };
          cloudMessageModel.unsubscribeToTopic(unsubscribeInfo, (success) => {
            let code = success.code;
            let message = success.message;
            if(code === 300) {
              console.log(message);
            }
          }, (error) => {
            console.log(error);
          });
        }
      }, (error) => {
        // if err
      })
    }
    else {
      // back to me page
    }
  }
  // change aboutMe flag
  bookFlagHandler = (e) => {
    console.log('Change book flag!')
    e.stopPropagation();
    this.setState({
      myPendingBookFlag: false
    }, () => {
      console.log('Pending flag: ' + this.state.myPendingBookFlag);
      // refresh my book list
      this.fetchMyBookList();
    });
  }
  // change aboutMe flag
  pendingBookFlagHandler = (e) => {
    console.log('Change pending book flag!')
    e.stopPropagation();
    // setState callback
    this.setState({
      myPendingBookFlag: true
    }, () => {
      console.log('Pending flag: ' + this.state.myPendingBookFlag);
      this.fetchMyPendingBookList();
    });
    // console.log('Pending flag: ' + this.state.myPendingBookFlag);
  }
  backToDefaultList = () => {
    console.log('Icon click.');
    let uid = this.state.uid;
    location.hash = `/default_index_list/${uid}/search=null`;
  }
  // delete book
  bookDeleteHandler = (bk_scl, bk_major, bk_id, buyer_id) => {
    console.log(bk_scl + ' ' + bk_major + ' ' + bk_id);
    if(confirm('Delete this book from your account?')) {
      let deleteToken = {
        bk_scl: bk_scl,
        bk_major: bk_major,
        bk_id: bk_id,
        uid: this.state.uid.split('_')[1],
        buyer_id: buyer_id,
        mode: 'deleteFromAboutMe'
      };
      bookModel.deleteBookInfo(deleteToken, (success) => {
        let code = success.code;
        let message = success.message;
        if(code === 300) {
          alert(message);
          window.location.reload();
        }
      }, (error) => {

      });
    }
  }
  // display list
  displayMyBookList = () => {
    let myBookList = this.state.list;
    return myBookList.map(function(listItem, listIndex) {
      return(
        <div className="me-list-content-container" key={listItem.Book_ID}>
          <li className="me-list-item-block">
            <div className="me-list-item-name">
              {listItem.Book_Name}
            </div>
            <div className="me-list-item-price">
              CAD $ {listItem.Book_Price}
            </div>
            <div className="delete-block">
                delete
                <div onClick={() => {this.bookDeleteHandler(listItem.School, listItem.Major, listItem.Book_ID, listItem.BuyerUID)}}></div>
            </div>
          </li>
        </div>
      );
    }, this);
  }
  // display pending lsit
  displayMyPendingBookList = () => {
    console.log('Display pending books.');
    let myPendingBookList = this.state.pendingList;
    return myPendingBookList.map(function(listItem, listIndex) {
      return(
        <div className="me-pending-list-content-container" key={listItem.Bookname}>
          <li className="me-pending-list-item-block">
            <div className="me-pending-list-item-name">
              {listItem.Bookname}
            </div>
            <div className="me-pending-list-item">
              $ {listItem.Price}
            </div>
            <div className="me-pending-list-item">
              {listItem.Username}
            </div>
            <div className="me-pending-list-item">
              {listItem.ExtraContact}
            </div>
          </li>
        </div>
      );
    }, this);
  }
  render() {
    console.log('pending list states:');
    console.log(this.state.pendingList);
    let aboutMeTemplate = this.state.myPendingBookFlag ? (
      <ul className="me-list-content-block" style={{listStyle:'none'}}>
        {this.displayMyPendingBookList()}
      </ul>
    ) : (
      <ul className="me-list-content-block" style={{listStyle:'none'}}>
        {this.displayMyBookList()}
      </ul>
    );
    console.log('LIST: ');
    console.log(aboutMeTemplate);
    return(
      <div className="user-item-container">
        <div className="headLine">
          <div className="icon-item-block">
            <a className="icon-item" onClick={() => {this.backToDefaultList()}}>Booktree</a>
          </div>
          <div className="rightPart-container">
            <div className="top-item">
              <span className="log-out-prompt-container">
                <span className="log-out-prompt">You are now logged in as: </span>
                <span className="log-out-name">{this.state.username}</span>
                <span className="log-out-prompt-gap"></span>
              </span>
              <a  className="log-out-icon" onClick={(e) => {this.logoutFirebaseAccount(e)}}>Log Out</a>
            </div>
            <div className="nav-item-block">
              <NavigationBar uid={this.state.uid} mode={'me'}/>
            </div>
          </div>
        </div>
        <div></div>
        <div className="me-nav-container">
          <div className="me-nav-title">
            <div className={this.state.myPendingBookFlag ? "typing-field-inactive" : "typing-field-active"} onClick={(e) => {this.bookFlagHandler(e)}}>My books</div>
            <div className={this.state.myPendingBookFlag ? "typing-field-active" : "typing-field-inactive"} onClick={(e) => {this.pendingBookFlagHandler(e)}}>My pending books</div>
          </div>
          {aboutMeTemplate}
        </div>
      </div>
    );
  }
}

export default Me;
