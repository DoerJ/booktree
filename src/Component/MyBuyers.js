import React, { Component } from 'react';
import { render } from 'react-dom';
import { bookModel, buyerModel } from '../DataModel/dataModel';
import { localStorageModel } from '../LocalStorage/localStorage';
import NavigationBar from './NavigationBar';
import '../style/style.css';
import '../style/MyBuyers.css';

/* global location */
/* eslint no-restricted-globals: ["off", "location"] */

class MyBuyers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.match.params.uid,
      list: []
    };
  }
  componentWillMount = () => {
    // refresh buyer counts
    localStorageModel.removeItemFromLocal('BUYERS_COUNTS_DIFF');
    localStorageModel.storeItemToLocal('BUYERS_COUNTS_DIFF', 0);
    this.refreshBuyerCountsDiff();
  }
  componentDidMount = () => {
    this.fetchMyBuyers();
  }
  // fetch buyer list
  fetchMyBuyers = () => {
    let req = {
      uid: this.state.uid.split('_')[1]
    };
    bookModel.fetchBuyerList(req, (success) => {
      let code = success.code;
      if(code === 300) {
        this.setState({
          list: success.message
        });
      }
    }, (error) => {

    });
  }
  // handle buyer count refresh
  refreshBuyerCountsDiff = () => {
    buyerModel.refreshCountsDiff({uid: this.state.uid.split('_')[1]}, (success) => {
      console.log(success.message);
    }, (error) => {
      console.log(error);
    });
  }
  // cancel the current transcation
  transcationCancelHandler = (school, major, bookId, buyerId) => {
    let transactionCancelToken = {
      uid: this.state.uid.split('_')[1],
      school: school,
      major: major,
      bookId: bookId,
      buyerId: buyerId
    }
    if(confirm('Cancel this transaction?')) {
      bookModel.cancelTransaction(transactionCancelToken, (success) => {
        let code = success.code;
        let message = success.message;
        if(code === 300) {
          alert(message);
          window.location.reload();
        }
      }, (error) => {
        console.log(error);
      });
    }
  }

  // delete the currrent transaction
  transactionDeleteHandler = (bk_scl, bk_major, bk_id, buyer_id) => {
    let transactionEndToken = {
      bk_scl: bk_scl,
      bk_major: bk_major,
      bk_id: bk_id,
      uid: this.state.uid.split('_')[1],
      buyer_id: buyer_id,
      mode: 'deleteFromMyBuyersList'
    };
    if(confirm('Transaction finished?')) {
      bookModel.endTransaction(transactionEndToken, (success) => {
        let code = success.code;
        let message = success.message;
        if(code === 300) {
          alert(message);
          window.location.reload();
        }
      }, (error) => {
        console.log(error);
      });
    }
  }
  backToDefaultList = () => {
    console.log('Icon click.');
    let uid = this.state.uid;
    location.hash = `/default_index_list/${uid}/search=null`;
  }
  displayBuyerList = () => {
    let buyerList = this.state.list;
    return buyerList.map(function(listItem, listIndex) {
      return(
        <div className="buyer-list-container" key={listItem.Book_ID}>
          <li className="buyer-info-container">
          <div className="first-line-container">
            <div className="list-item-name">
              {listItem.Book_Name}
            </div>
          </div>
          <div className="bottom-line-container">

            <div className="activities-container">
              <div className="finish-block"  onClick={() => {this.transactionDeleteHandler(listItem.School, listItem.Major, listItem.Book_ID, listItem.BuyerUID)}}>
                Finish
                <div></div>
              </div>
              <div className="cancel-block" onClick={() => {this.transcationCancelHandler(listItem.School, listItem.Major, listItem.Book_ID, listItem.BuyerUID)}}>
                Cancel
                <div></div>
              </div>
            </div>
            <div className="buyer-list-item-content">
              CAD $ {listItem.Book_Price}
            </div>
            <div className="buyer-list-item-content">
              {listItem.Username}
            </div>
            <div className="buyer-list-item-content">
              {listItem.Email}
            </div>
          </div>
          </li>
        </div>
      );
    }, this);
  }
  render() {
    return(
      <div className="MyBuyers-container">
      <div className="headLine">
        <div className="icon-item-block">
          <a className="icon-item" onClick={() => {this.backToDefaultList()}}>Booktree</a>
        </div>
        <div className="nav-item-block">
          <NavigationBar uid={this.state.uid} mode={'buyer'}/>
        </div>
      </div>
      <div></div>
      <div className="buyer-list-title-container">
        <div></div>
        <div className="buyer-list-title">
        <div className="section-title">Price</div>
        <div className="section-title">Buyer</div>
        <div className="section-title">Buyer email</div>
        </div>
      </div>
        <ul className="buyer-list-content-block" style={{listStyle:'none'}}>
          {this.displayBuyerList()}
        </ul>
      </div>
    );
  }
}

export default MyBuyers;
