import React, { Component } from 'react';
import { render } from 'react-dom';
import { bookModel } from '../DataModel/dataModel';
import '../style/BookDetailedInfo.css';
/* global location */
/* eslint no-restricted-globals: ["off", "location"] */
// button style
var buttonStyle = {
  border: '1px solid black',
  backgroundColor: 'black',
  color: 'white',
  padding: '3px 20px'
};

class BookDetailedInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.match.params.uid.split('_')[1],
      bk_id: this.props.match.params.bkid.split('_')[1],
      imageDownloadURL: '',
      // scl for searching
      bk_scl: this.props.match.params.scl_major.split('_')[0],
      // major for searching
      bk_major: this.props.match.params.scl_major.split('_')[1].split(/[0-9]/)[0],
      bk_name: '',
      bk_description: '',
      bk_author: '',
      bk_school: '',
      bk_course: '',
      bk_edition: '',
      bk_price: '',
      bk_seller_username: '',
      bk_seller_id: '',
      bk_seller_email: '',
      bk_extra_contact: ''
    };
    console.log('bk_id: ' + this.state.bk_id);
  }

  componentWillMount = () => {

  }

  componentDidMount = () => {
    this.bookInfoSearchHandler();
  }
  // handle searching bk_info
  bookInfoSearchHandler = () => {
    let uid = this.state.uid;
    let bk_id = this.state.bk_id;
    let bk_scl = this.state.bk_scl;
    let bk_major = this.state.bk_major;
    let bkInfo = {
      uid: uid,
      bk_id: bk_id,
      bk_scl: bk_scl,
      bk_major: bk_major
    };
    bookModel.fetchBookDetailedInfo(bkInfo, (success) => {
      var code = success.code;
      var bkInfo = success.message;
      //console.log(success.message);
      if(code === 300) {
        this.setState({
          imageDownloadURL: bkInfo.Image,
          bk_name: bkInfo.Book_Name,
          bk_description: bkInfo.Book_Description,
          bk_author: bkInfo.Author,
          bk_school: bkInfo.School,
          bk_course: bkInfo.Course_Number,
          bk_edition: bkInfo.Edition,
          bk_price: bkInfo.Price,
          bk_seller_username: bkInfo.Username,
          bk_seller_id: bkInfo.Seller,
          bk_seller_email: bkInfo.Email,
          bk_extra_contact: bkInfo.ExtraContact
        });
      }
    }, (error) => {
      console.log(error);
    });
  }

  // handle display
  bookInfoDisplayHandler = () => {
    return(
      <div className="book-list-container">
      <div className=""><h1>BookTree</h1></div>

        <div className="image-download-container">
          <img src={this.state.imageDownloadURL}/>
        </div>
        <div className="book-info-container">
          <div className="book-price">CAD $ <span>{this.state.bk_price}</span></div>
          <div className="book-title"> {this.state.bk_name}</div>
          <div className="book-description"><div className="descriptionIcon"></div>{this.state.bk_description}</div>

          <div className="book-list-block"><span>Author: {this.state.bk_author}</span></div>
          <div className="book-list-block"><span>Edition: {this.state.bk_edition}</span></div>
          <div className="book-list-block"><span>School: {this.state.bk_school}<div className="book-chain-Icon"></div> Course: {this.state.bk_course}</span></div>
          <div className="book-list-block"><span>Book seller: {this.state.bk_seller_username}</span></div>
          <div className="submit-block">
            <a className="search-box-button" onClick={() => {this.tradeConfirmHandler()}}>Buy</a>
          </div>
        </div>
      </div>
    );
  }
  // handle trade confirmation
  tradeConfirmHandler = () => {
    if(confirm('Buy this book?')) {
      // check if book is valid
      let bk_major = this.state.bk_course.split(/[0-9]/)[0];
      let infoForValidation = {
        bk_school: this.state.bk_school,
        bk_major: bk_major,
        bk_id: this.state.bk_id,
        // buyer uid
        uid: this.state.uid,
        seller: this.state.bk_seller_id,
        seller_email: this.state.bk_seller_email,
        bk_name: this.state.bk_name,
        bk_price: this.state.bk_price,
        bk_seller_username: this.state.bk_seller_username,
        bk_extra_contact: this.state.bk_extra_contact
      };
      bookModel.tradeConfirmation(infoForValidation, (success) => {
        let code = success.code;
        let message = success.message;
        if(code === 300) {
          alert(message);
          location.hash = `/default_index_list/uid_${this.state.uid}/search=null`;
        }
        else if(code === 401) {
          alert(message);
          return;
        }
      }, (error) => {
        console.log(error);
      });
    }
  }

  // re-render all component whenever setState() is called
  render() {
    return(
      <div className="book-detail-container">
      <div></div>
        <div className="content-display-container">
          {this.bookInfoDisplayHandler()}

        </div>
      </div>
    );
  }
}

export default BookDetailedInfo;
