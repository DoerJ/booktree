import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import { bookModel } from '../DataModel/dataModel';
import { localStorageModel } from '../LocalStorage/localStorage';
import { dateDiff } from '../dateTools/dateDiff';
import NavigationBar from './NavigationBar';
import '../style/DefaultIndexList.css';
import '../style/style.css'

/* global location */
/* eslint no-restricted-globals: ["off", "location"] */

class DefaultIndexList extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    var searchObj = this.props.match.params.search.split('=')[1];
    var searchFlag;
    switch(searchObj) {
      case 'null':
        searchFlag = false;
        break;
      default:
        searchFlag = true;
        break;
    }
    this.state = {
      selectValue: 'bookname',
      searchType: 'booknameSearch',
      searchFlag: searchFlag,
      searchNameFlag: true,
      searchMajorFlag: false,
      list: [],
      defaultList: [],
      // uid_{uid}
      uid: this.props.match.params.uid,
      windowScrollY: 0
    };
    console.log('constructor search flag: ' + this.state.searchFlag);
  }
  // initialization
  componentWillMount = () => {
    // let newBuyerCounts = localStorageModel.fetchItemFromLocal('BUYERS_COUNTS_DIFF');
    // this.setState({
    //   newBuyerCounts: parseInt(newBuyerCounts)
    // });

    console.log(this.state.searchFlag);
    this.handleDefaultListFetch();
  }

  componentDidMount = () => {
    console.log('componentDidMount');
    // window.addEventListener('scroll', () => {
    //   console.log('window scrollY: ' + window.scrollY);
    // });
    // set scroll position
    let windowScrollY = localStorageModel.fetchItemFromLocal('SCROLLY');
    localStorageModel.removeItemFromLocal('SCROLLY');
    console.log('scrollY in DIDMOUNT: ' + windowScrollY);
    //window.scrollTo(0, windowScrollY);
    this.setState({
      windowScrollY: windowScrollY
    });
    console.log(this.props);
    console.log('Search flag: ' + this.state.searchFlag);
    let mode = localStorageModel.fetchItemFromLocal('MODE');
    localStorageModel.removeItemFromLocal('MODE');
    console.log('mode: ' + mode);
    if(!this.state.searchFlag) {
      // refresh default list
      this.handleDefaultListFetch();
      return;
    }
    switch(mode) {
      case 'bookname':
        this.setState({
          selectValue: 'bookname',
          searchType: 'booknameSearch'
        }, function() {
          var searchKey = localStorageModel.fetchItemFromLocal('FORM');
          localStorageModel.removeItemFromLocal('FORM');
          this.handleNameSearch(searchKey);
        });
        break;
      case 'school_course':
        console.log('fetch course search');
        this.setState({
          selectValue: 'school-course',
          searchType: 'school_courseSearch'
        }, function() {
          var searchKeys = localStorageModel.fetchItemFromLocal('FORM');
          var search_scl = searchKeys.split('&')[0];
          var search_course = searchKeys.split('&')[1];
          this.handleCourseSearch(search_scl, search_course);
        });
        break;
    }
    //let formValue = localStorage.getItem('FORM');
    //console.log('storage value: ' + formValue);
    // if(this.state.searchFlag && this.state.searchNameFlag) {
    //   //var searchKey = localStorageModel.fetchItemFromLocal('FORM');
    //   var searchKey = localStorageModel.fetchItemFromLocal('FORM');
    //   localStorageModel.removeItemFromLocal('FORM');
    //   this.handleNameSearch(searchKey);
    // }
    // else if(this.state.searchFlag && this.state.searchMajorFlag) {
    //   console.log('fetch course search');
    //   var searchKeys = localStorageModel.fetchItemFromLocal('FORM');
    //   var search_scl = searchKeys.split('&')[0];
    //   var search_course = searchKeys.split('&')[1];
    //   this.handleCourseSearch(search_scl, search_course);
    // }
  }

  componentWillUnmount = () => {
    console.log('scrollY during UNMOUNT: ' + window.scrollY);
    this.windowScrollHandler();
    // this.setState({
    //   windowScrollY: window.scrollY
    // }, () => {
    //   console.log('scrollY after UNMOUNT: ' + this.state.windowScrollY);
    // });
  }

  windowScrollHandler = () => {
    // reserve scrollY
    localStorageModel.storeItemToLocal('SCROLLY', window.scrollY);
  }
  // // home page link
  // backToHomePage() {
  //   console.log('Back to homepage');
  // }
  // // new book publish
  // bookPublish() {
  //   console.log('Enter publish page!');
  //   let uid = this.state.uid;
  //   location.hash = `/book_publish/${uid}`;
  // }
  //
  // // display my buyers
  // displayMyBuyers() {
  //   console.log('Enter buyer page!');
  //   let uid = this.state.uid;
  //   location.hash = `/my_buyers/${uid}`;
  // }
  //
  // // Me info
  // aboutMe() {
  //   console.log('Enter me page!');
  //   let uid = this.state.uid;
  //   location.hash = `/me/${uid}`;
  // }

  // icon btn
  backToDefaultList = () => {
    console.log('Icon click.');
    let uid = this.state.uid;
    this.setState({
      searchFlag: false,
      searchNameFlag: true,
      searchMajorFlag: false,
      selectValue: 'bookname'
    }, () => {
      location.hash = `/default_index_list/${uid}/search=null`;
      //this.props.history.push(`/default_index_list/${uid}/search=null`);
    });
  }

  // handle bookname search
  handleNameSearch(searchKey) {
    //console.log('search');
    //e.stopPropagation();
    //let searchKey = this.refs.searchKey.value;
    // set local storage for form
    localStorageModel.storeItemToLocal('FORM', searchKey);
    localStorageModel.storeItemToLocal('MODE', 'bookname');
    console.log('search_key: ' + searchKey);
    let uid = this.state.uid;
    let searchType = this.state.searchType;
    // search key empty
    if(searchKey === '') {
      alert('The search key cannot be empty!');
    }
    // search by bookname
    else {
      location.hash = `/default_index_list/${uid}/${searchType}=${searchKey}`;
      this.setState({
        searchFlag: true,
        searchNameFlag: true,
        searchMajorFlag: false
      }, function() { // callback
        console.log(this.state.searchNameFlag);
        var keywordInfo = {
          key: searchKey.toUpperCase()
        };
        bookModel.searchBookByName(keywordInfo, (success) => {
          var list = success.list;
          console.log(list);
          this.setState({
            list: list
          });
          // if search successful
        }, (error) => {
          // if error
          console.log(error);
        });
      });
    }
  }
  // handle course search
  handleCourseSearch(searchKey_scl, searchKey_course) {
    console.log(searchKey_scl + ' + ' + searchKey_course);
    localStorageModel.storeItemToLocal('FORM', `${searchKey_scl}&${searchKey_course}`);
    localStorageModel.storeItemToLocal('MODE', 'school_course');
    switch('') {
      case searchKey_scl:
        alert('Please fill in the school name');
        return;
      case searchKey_course:
        alert('Please fill in the course name');
        return;
    }
    let uid = this.state.uid;
    let searchType = this.state.searchType;
    location.hash = `/default_index_list/${uid}/${searchType}=${searchKey_scl}+${searchKey_course}`;
    //this.props.history.push(`/default_index_list/${uid}/${searchType}=${searchKey_scl}+${searchKey_course}`);
    this.setState({
      searchFlag: true,
      searchNameFlag: false,
      searchMajorFlag: true
    }, function() {
      let upperCaseSchool = searchKey_scl.toUpperCase();
      let upperCaseCourse = searchKey_course.toUpperCase();
      let noSpaceCourse = upperCaseCourse.replace(/\s+/g, '');
      let keywordInfo = {
        key_scl: upperCaseSchool,
        key_course: noSpaceCourse,
        key_major: noSpaceCourse.split(/[0-9]/)[0]
      };
      bookModel.searchBookByCourse(keywordInfo, (success) => {
        let list = success.list;
        console.log(list);
        this.setState({
          list: list
        });
      }, (error) => {
        console.log(error);
      });
    });
  }
  // fetch default list
  handleDefaultListFetch() {
    bookModel.fetchDefaultBookList({}, (success) => {
      let code = success.code;
      let list = success.list;
      if(code === 300) {
        this.setState({
          defaultList: list
        });  
      }
    }, (error) => {
      console.log(error);
    });
  }
  // display book search results
  displayBookIndexList = () => {
    let bookIndexList = this.state.list;
    let uid = this.state.uid;
    return bookIndexList.map(function(listItem, listIndex) {
      return(
        <div className="list-content-container" key={listItem.Book_ID}>
        <Link className="item-link" to={'/bk_detailed_info/' + uid + '/' + `bkid_${listItem.Book_ID}` + '/' + `${listItem.School}_${listItem.Course_Number}`} style={{textDecoration:'none', color:'#000'}}>
          <li className="list-item-block">
            <div className="leftside-content-container">
              <img src={listItem.Image}/>
            </div>
            <span className="rightside-content-container">
            <div className="top-content-container">
              <div className="book_name">
                {listItem.Book_Name}
              </div>
              <div className="create_time">
                Create at: {dateDiff(listItem.Create_Date.seconds * 1000)}
              </div>
            </div>
              <div className="bottom-content-container">
                <div className="list-item-content left">
                  {listItem.Author}
                </div>
                <div className="list-item-content">
                  {listItem.Edition}
                </div>
                <div className="list-item-content">
                  {listItem.School} & {listItem.Course_Number}
                </div>
                <div className="list-item-content right">
                  CAD ${listItem.Price}
                </div>
              </div>
            </span>
          </li>
        </Link>
        </div>
      );
    });
  }
  // display books by date
  displayBookByDate = () => {
    let bookListByDate = this.state.defaultList;
    let uid = this.state.uid;
    return bookListByDate.map(function(listItem, listIndex) {
      return(
        <div className="list-content-container" key={listItem.Book_ID}>
          <Link className="item-link" to={'/bk_detailed_info/' + uid + '/' + `bkid_${listItem.Book_ID}` + '/' + `${listItem.School}_${listItem.Course_Number}`} style={{textDecoration:'none', color:'#000'}}>
            <li className="list-item-block">
              <div className="leftside-content-container">
                <img src={listItem.Image}/>
              </div>
              <span className="rightside-content-container">
                <div className="top-content-container">
                  <div className="book_name">
                    {listItem.Book_Name}
                  </div>
                  <div className="create_time">
                    Create at: {dateDiff(listItem.Create_Date.seconds * 1000)}
                  </div>
                </div>
                <div className="bottom-content-container">
                  <div className="list-item-content left">
                    {listItem.Author}
                  </div>
                  <div className="list-item-content">
                    {listItem.Edition}
                  </div>
                  <div className="list-item-content">
                    {listItem.School}<div className="chain-Icon"></div>{listItem.Course_Number}
                  </div>
                  <div className="list-item-content right">
                    CAD ${listItem.Price}
                  </div>
                </div>

              </span>
            </li>
          </Link>
        </div>
      );
    });
  }
  // handle dropdown list change
  changeHandler(e) {
    console.log('Selection changed.');
    // bookname or scl-major search
    let searchType = '';
    let searchValue = e.target.value;
    switch(searchValue) {
      case 'bookname':
        searchType = 'booknameSearch';
        this.setState({
          searchNameFlag: true,
          searchMajorFlag: false
        });
        break;
      case 'school-course':
        searchType = 'school_courseSearch';
        this.setState({
          searchMajorFlag: true,
          searchNameFlag: false
        });
        break
    }
    console.log('Search type: ' + searchType);
    this.setState({
      selectValue: searchValue,
      searchType: searchType
    });
  }

  render() {
    // restore scroll position
    window.scrollTo(0, this.state.windowScrollY);
    // content of the list
    let list = this.state.searchFlag ? (
      // list by search
      <ul className="list-content-block">
        {this.displayBookIndexList()}
      </ul>
    ) : (
      // list by date
      <ul className="list-content-block">
        {this.displayBookByDate()}
      </ul>
    )
    let inputField = this.state.searchNameFlag ? (
      <div className="input-field-container">
        <input className="search-box-field" type="text" ref="searchKey" placeholder="What's the bookname?"/>
      </div>
    ) : (
      <div className="input-field-container">
        <div className="input-field-block">
          <input className="search-box-field half" type="text" ref="searchKey_scl" placeholder="School?"/>
        </div>
        <div className="input-field-block">
          <input className="search-box-field half" type="text" ref="searchKey_course" placeholder="Course?"/>
        </div>
      </div>
    );
    let submitBtn = this.state.searchNameFlag ? (
      <div className="search-submit-button-container" onClick={() => {this.handleNameSearch(this.refs.searchKey.value)}}></div>
    ) : (
      <div className="search-submit-button-container" onClick={() => {this.handleCourseSearch(this.refs.searchKey_scl.value, this.refs.searchKey_course.value)}}></div>
    )
    return(
      <div className="bookList-item-container">
        <div className="headLine">
          <div className="icon-item-block">
            <a onClick={() => {this.backToDefaultList()}}>Booktree</a>
          </div>
          <div className="nav-item-block">
            <NavigationBar uid={this.state.uid} mode={'home'}/>
          </div>
        </div>
          <div className="search-box-container">
            <div className="searchBy">
              <select value={this.state.selectValue} onChange={(e) => {this.changeHandler(e)}}>
                <option value="bookname">Bookname</option>
                <option value="school-course">School & Course</option>
              </select>
            </div>
            <div className="inputSection">
              {inputField}
              {submitBtn}
            </div>
            <div></div>
          </div>
          <div className="list-title-container">
            <div></div>
            <div className="list-title">
            <div className="title">Author</div>
            <div className="title">Edition</div>
            <div className="title">School & Course</div>
            <div className="title">Price</div>
            </div>
          </div>
        {list}
      </div>
    );
  }
}

export default DefaultIndexList;
