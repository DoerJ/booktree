import React, { Component } from 'react';
import { render } from 'react-dom';
import { userModel, bookModel } from '../DataModel/dataModel';
import { uploadDataConfig } from '../DataModel/uploadDataModel';
import NavigationBar from './NavigationBar';
import '../style/style.css';
import '../style/CreateBook.css';

//const axios = require('axios');
let services = require('../Database/firebase');
let firebase = services.firebase;
let storage = firebase.storage();
let storageRef = storage.ref();
/* global location */
/* eslint no-restricted-globals: ["off", "location"] */

class CreateBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.match.params.uid,
      file: null,
      imageDownloadURL: '',
      inputBookname:'',
      inputAuthor:'',
      inputEdition:'',
      inputSchool:'',
      inputCourse:'',
      inputDescription:'',
      inputPrice:'',
      inputContact:'',
      progressVal: 0,
      progressOn: false,
      progressFinished: false
    };

  }

  // handle new book publish
  handlePublish() {
    console.log('publish!');
    //
    // // upload image
    // let file = this.state.file;
    // axios.post('http://localhost:3000/upload/imagefile', file, uploadDataConfig).then((res) => {
    //
    // }).catch((err) => {
    //
    // });

    // validate inputs
    let bookName = this.refs.bookName.value;
    let bookAuthor = this.refs.bookAuthor.value;
    let bookEdition = this.refs.bookEdition.value;
    let bookSchool = this.refs.bookSchool.value;
    let bookCourse = this.refs.bookCourse.value;
    let bookDescription = this.refs.bookDscrip.value;  // optional
    let bookPrice = this.refs.bookPrice.value;
    let additionalContact = this.refs.additionalContact.value;
    let imageDownloadURL = this.state.imageDownloadURL;
    // extract uid from url
    let bookSeller = this.state.uid.substr(4);

    var uppercaseBookSchool = bookSchool.toUpperCase();
    var uppercaseBookCourse = bookCourse.toUpperCase();
    var noSpaceBookCourse = uppercaseBookCourse.replace(/\s+/g, '');
    var bookMajor = noSpaceBookCourse.split(/[0-9]/)[0];
    console.log('school name: ' + uppercaseBookSchool);
    console.log('course name: ' + noSpaceBookCourse);
    console.log('major name: ' + bookMajor);

    if(bookName === '') {
      alert('Please provide the bookname.');
      return;
    }
    else if(bookAuthor === '') {
      alert('Please provide the author of the book.');
      return;
    }
    else if(bookEdition === '') {
      alert('Please provide the edition of the book.');
      return;
    }
    else if(bookSchool === '') {
      alert('Please provide the school which the book is used to.');
      return;
    }
    else if(bookCourse === '') {
      alert('Please provide the course which the book is used to.');
      return;
    }
    else if(bookPrice === '') {
      alert('Please provide the price of the book.');
      return;
    }
    // send new book info to server
    let bookInfo = {
      bookName: bookName,
      bookAuthor: bookAuthor,
      bookEdition: bookEdition,
      bookMajor: bookMajor,
      bookSchool: uppercaseBookSchool,
      bookCourse: noSpaceBookCourse,
      bookDescription: bookDescription,
      bookPrice: bookPrice,
      bookStatus: 'A',
      bookSeller: bookSeller,
      additionalContact: additionalContact,
      imageDownloadURL: imageDownloadURL,
      bk_id: null   //to be updated with doc id
    }
    //console.log('Book author: ' + bookInfo.bookAuthor);
    bookModel.publish(bookInfo, (success) => {
      // if publish successful
      let code = success.code;
      let message = success.message;
      if(code === 300) {
        alert(message);
        location.hash = `/default_index_list/uid_${bookSeller}/search=null`;
      }
    }, (error) => {
      console.log(error);
    });
    //console.log('bk_id: ' + bkId);
  }
  // onChange handler
  onChangeHandler(e) {
    //let image = e.target.files[0];
    let fileUpload = e.target.files[0];
    //let uploadData = new FormData();
    //uploadData.append('file', fileUpload);
    this.setState({
      file: fileUpload
    }, () => {
      console.log(this.state.file);
      this.fileUploadHandler();
    });
  }
  // handle file upload
  fileUploadHandler = () => {
    let imageFile = this.state.file;
    //let imageDownloadURL = '';
    console.log('filename: ' + imageFile.name);
    let fileUploading = storageRef.child(`Images/${imageFile.name}`).put(imageFile);
    fileUploading.on('state_changed', (snapshot) => {
      // uploading progress
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      this.setState({
        progressVal: Math.round(progress),
        progressOn: true
      });
    }, function(error) {
      // error handler
      console.log(error);
    }, () => {
      // handle successful upload
      fileUploading.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log('File available at', downloadURL);
        //imageDownloadURL = downloadURL;
        this.setState({
          imageDownloadURL: downloadURL,
          progressFinished: true
        });
      });
    });
  }
  updateBooknameValue(e) {
    this.setState({
      inputBookname: e.target.value,
    });
    e.preventDefault();
  }
  updateAuthorValue(e) {
    this.setState({
      inputAuthor: e.target.value,
    });
    e.preventDefault();
  }
  updateEditionValue(e) {
    this.setState({
      inputEdition: e.target.value,
    });
    e.preventDefault();
  }
  updateSchoolValue(e) {
    this.setState({
      inputSchool: e.target.value,
    });
    e.preventDefault();
  }
  updateCourseValue(e) {
    this.setState({
      inputCourse: e.target.value,
    });
    e.preventDefault();
  }
  updateDescriptionValue(e) {
    this.setState({
      inputDescription: e.target.value,
    });
    e.preventDefault();
  }
  updatePriceValue(e) {
    this.setState({
      inputPrice: e.target.value,
    });
    e.preventDefault();
  }
   updateContactValue(e) {
      this.setState({
        inputContact: e.target.value,
      });
      e.preventDefault();
    }
    backToDefaultList = () => {
      console.log('Icon click.');
      let uid = this.state.uid;
      location.hash = `/default_index_list/${uid}/search=null`;
    }

  render() {
    let progressBar;
    if(this.state.progressFinished) {
      progressBar = (
        <div className="progress-notification">Upload Completed</div>
      );
    }
    else {
      progressBar = this.state.progressOn ? (
        <div className="progress-item-container">
          <span className="progress-item">Uploading: </span>
          <span className="progress-bar">{this.state.progressVal}%</span>
        </div>
      ) : (
        <div></div>
      );
    }
    return(
      <div className="create-book-container">
        <div className="headLine">
          <div className="icon-item-block">
            <a className="icon" onClick={() => {this.backToDefaultList()}}>Booktree</a>
          </div>
          <div className="nav-item-block">
            <NavigationBar uid={this.state.uid} mode={'publish'}/>
          </div>
        </div>
        <div></div>
        <div className="main-container">
          <div className="background-container"></div>
          <div className="book-container">
              <div className="typing-field-prompt">Sell your Book</div>
              <div className="book-info-segments">
                <span className={this.state.inputBookname ? "field-active" : ""}>Bookname</span>
                <input className="long-typing-field-input" value={this.state.inputBookname} onChange={(e) => {this.updateBooknameValue(e)}}  ref="bookName" placeholder="Bookname"/>
              </div>
              <div className="book-info-segments">
                <span className={this.state.inputAuthor ? "field-active" : ""}>Author</span>
                <input className="long-typing-field-input" value={this.state.inputAuthor} onChange={(e) => {this.updateAuthorValue(e)}}  ref="bookAuthor" placeholder="Author"/>
              </div>
              <div className="book-info-segments">
                <span className={this.state.inputEdition ? "field-active" : ""}>Edition</span>
                <input className="typing-field-input" value={this.state.inputEdition} onChange={(e) => {this.updateEditionValue(e)}}  ref="bookEdition" placeholder="Edition"/>
              </div>
              <div className="two-input-container">
                <div className="book-info-segments">
                  <span className={this.state.inputSchool ? "field-active" : ""}>School</span>
                  <input className="typing-field-input" value={this.state.inputSchool} onChange={(e) => {this.updateSchoolValue(e)}}  ref="bookSchool" placeholder="School"/>
                </div>
                <div className="input-icon"></div>
                <div className="book-info-segments">
                  <span className={this.state.inputCourse ? "field-active" : ""}>Course</span>
                  <input className="typing-field-input" value={this.state.inputCourse} onChange={(e) =>{this.updateCourseValue(e)}}  ref="bookCourse" placeholder="Course"/>
                </div>
              </div>
              <div className="book-info-segments">
                <span className={this.state.inputDescription ? "field-active" : ""}>Book Description</span>
                <input className="long-typing-field-input" value={this.state.inputDescription} onChange={(e) => {this.updateDescriptionValue(e)}}  ref="bookDscrip" placeholder="Book Description"/>
              </div>
              <div className="book-info-segments">
                <span className={this.state.inputContact ? "field-active" : ""}>Additional contact </span>
                <input className="long-typing-field-input" value={this.state.inputContact} onChange={(e) => {this.updateContactValue(e)}}  ref="additionalContact" placeholder="Additional contact"/>
              </div>
            <div className="two-input-container" >
              <div className="price-title">CAD $</div>
              <div className="book-info-segments">
                <span className={this.state.inputPrice ? "field-active" : ""}>Price</span>
                <input className="typing-field-input" value={this.state.inputPrice} onChange={(e) => {this.updatePriceValue(e)}} placeholder="Price" ref="bookPrice"/>
                <span style={{padding:'0px 100px'}}></span>
              </div>
            </div>
            <div className="last-line-container">
            <div className="two-input-container">
              <div className="price-title">Upload Image</div>
              <div className="input-uploadImage">
               <input type="file" name="image" onChange={(e) => {this.onChangeHandler(e)}}/>
               <div>{progressBar}</div>
              </div>
            </div>
             <div className="create-submit-field-container">
               <a onClick={() => {this.handlePublish()}}>Sell</a>
             </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateBook;
