// api that handles req and res

const API = 'http://localhost:3000/';

// send http requests
function _request(_method, _api, _params, _success, _error) {

  //console.log('Request has been sent out!');

  // build packet
  let init = {
    method: _method,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    // get or post method
    // JSON.stringify() convert js value to json value
    body: (_method === 'GET') ? null : JSON.stringify(_params)
  };
  // fetch resource from url
  fetch(_api, init)
    // promise chain
    .then((response) => {
      // check the status of response
      if(response.ok) {
        //console.log("Successful response");
        return response;
      }
      else {
        // status code
        let error = new Error(response.statusText);
        error.state = response.status;
        error.response = response;
        throw error;
      }
    })
    .then((response) => {
      // convert response to json file
      return response.json();
    })
    .then((response) => {
      // pass the response content to component
      _success(response);
    })
    .catch((defer) => {
      // handlder for deferred object
      // if unauthorized
      if(defer.state === 401) {
        alert('TIMEOUT');
        return;
      }
    })
}

// user model
let userModel = {
  // register
  register: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}user/register`, params, success, error);
  },
  // login
  login: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}user/login`, params, success, error);
  },
  // logout
  logout: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}user/logout`, params, success, error);
  },
  // update user collection
  // updateUserCollection: (params, success, error) => {
  //   console.log(params);
  //   _request('POST', `${API}user/uid_publish`, params, success, error);
  // }
  resetPassword: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}user/reset_password`, params, success, error);
  },
  getRegistrationToken: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}user/get_registration_token`, params, success, error);
  },
  fetchUsername: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}user/get_username_in_logout_prompt`, params, success, error);
  }
}

// book model
let bookModel = {
  // publish
  publish: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}book/publish`, params, success, error);
  },
  // fetch myBook list
  fetchMyBookList: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}book/my_book`, params, success, error);
  },
  fetchMyPendingBookList: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}book/my_pending_book`, params, success, error);
  },
  fetchDefaultBookList: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}book/books_by_date`, params, success, error);
  },
  searchBookByName: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}book/searchbook_name`, params, success, error);
  },
  searchBookByCourse: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}book/searchbook_school_course`, params, success, error);
  },
  fetchBookDetailedInfo: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}book/book_details`, params, success, error);
  },
  tradeConfirmation: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}book/trade_confirm`, params, success, error);
  },
  fetchBuyerList: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}book/buyer_list`, params, success, error);
  },
  deleteBookInfo: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}book/delete_book`, params, success, error);
  },
  cancelTransaction: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}book/cancel_transac`, params, success, error);
  },
  endTransaction: (params, success, error) => {
    console.log(params);
    _request('POST', `${API}book/delete_book`, params, success, error);
  }
}

// cloud messaging
let cloudMessageModel = {
  // subscribe to topic
  subscribeToTopic: (params, success, error) => {
    _request('POST', `${API}message/subscribe_to_topic`, params, success, error);
  },
  unsubscribeToTopic: (params, success, error) => {
    _request('POST', `${API}message/unsubscribe_to_topic`, params, success, error);
  }
}

// buyer
let buyerModel = {
  refreshCountsDiff: (params, success, error) => {
    _request('POST', `${API}buyer/refresh_counts_diff`, params, success, error);
  }
}

export { userModel, bookModel, cloudMessageModel, buyerModel };
