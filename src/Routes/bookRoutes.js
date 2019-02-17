// Define middleware functions for books
var express = require('express');
var router = express.Router();
var path = require('path');
var bk_searchList = [];

//let auth = require('../Database/auth');
let services = require('../Database/firebase');
let auth = services.auth;
let db = services.db;

// cloud storage modules
let formidable = require('formidable');
// post book
router.post('/publish', function(req, res) {
  createNewBook(req, res);
});

async function createNewBook(req, res) {
  var bookInfo = req.body;
  //console.log(bookInfo);
  var dbCollection = 'Books';
  var bk_school = bookInfo.bookSchool;
  var bk_major = bookInfo.bookMajor;
  // bookInfo
  var Author = bookInfo.bookAuthor;
  //console.log('author: ' + Author);
  var bookDescription = bookInfo.bookDescription;
  //console.log('bk description: ' + bookDescription);
  var bk_id = bookInfo.bk_id;   // bk_id === null
  var bookName = bookInfo.bookName;
  var courseNumber = bookInfo.bookCourse;
  var bookEdition = bookInfo.bookEdition;
  var bookPrice = bookInfo.bookPrice;
  var bookSchool = bookInfo.bookSchool;
  var bookSeller = bookInfo.bookSeller;
  var bookStatus = bookInfo.bookStatus;
  var additionalContact = bookInfo.additionalContact;
  var imageDownloadURL = bookInfo.imageDownloadURL;

  // get book username
  var bookUsername;
  var bookEmail;
  const promiseToWait = [];
  let promise = db.collection('Users').doc(bookSeller).get().then(function(documentSnapShot) {
    bookUsername = documentSnapShot.data().Username;
    bookEmail = documentSnapShot.data().Email;
    console.log('bookEmail: ' + bookEmail);
  });
  promiseToWait.push(promise);
  const response = await Promise.all(promiseToWait);

  //console.log(dbCollection);
  let addBookPromise = await db.collection(dbCollection).doc(bk_school).collection(bk_major).add({
    Author: Author,
    Book_Description: bookDescription,
    Book_ID: bk_id,
    Book_Name: bookName,
    Course_Number: courseNumber,
    Create_Date: null,
    Edition: bookEdition,
    Email: bookEmail,
    ExtraContact: additionalContact,
    Image: imageDownloadURL,
    Price: bookPrice,
    School: bookSchool,
    Seller: bookSeller,
    Status: bookStatus,
    Username: bookUsername
  }).then(function(docRef) {
    console.log('Document generated with id: ' + docRef.id);
    bk_id = docRef.id;
    // update create_date
    var date = new Date();
    // update bk_id
    // var doc_id = docRef.id;
    db.collection(dbCollection).doc(bk_school).collection(bk_major).doc(bk_id).update({
      Book_ID: bk_id,
      Create_Date: date
    }).then(function() {
      // update successful
      console.log('The document is updated!');
    });
    // send response
    //console.log('BK_TIME: ' + date);
    res.send({
      code: 300,
      message: 'Your book has been successfully posted!',
      // bk_id: doc_id,
      // bk_school: bk_school,
      // bk_major: bk_major,
      // bk_price: bookPrice,
      // bk_date: date,
      // bk_name: bookName
    });
    // update Titles
    db.collection(dbCollection).doc(bk_school).get().then(function(documentSnapShot) {
      var tempTitles = documentSnapShot.data();
      var tempBookName = bookName.toUpperCase();
      var tempBookMajor = bk_major.toUpperCase();
      //var tempTitles = undefined;
      console.log(tempTitles);
      if(tempTitles === undefined) {
        console.log('THE TITLE IS UNDEFINED!');
        // if no title, add it
        db.collection(dbCollection).doc(bk_school).set({
          // Titles: array
          Titles: [`${tempBookName}_${tempBookMajor}_${bk_id}`]
        }).then(function() {
          console.log('Title has been added.');
        });
      }
      // if Titles has some values
      else {
        var newTitle = `${tempBookName}_${tempBookMajor}_${bk_id}`;
        var updateTitles = documentSnapShot.data().Titles;
        updateTitles.push(newTitle);
        // title exists
        db.collection(dbCollection).doc(bk_school).update({
          Titles: updateTitles
        }).then(function() {
          console.log('Title has been updated.');
        });
      }
    });
    // update user collection
    db.collection('Users').doc(bookSeller).collection('Sell').doc(bk_id).set({
      Book_Name: bookName,
      Book_Price: bookPrice,
      Create_Date: date,
      School: bk_school,
      Major: bk_major,
      Book_ID: bk_id,
      Username: null,
      Email: null,
      BuyerUID: null
    }).then(function() {
      // if update successful
      console.log('User collection updated!');
      res.send({
        code: 300,
        message: 'USER collection has been updated.'
      });
    });
  }).catch(function(err) {
    console.log(err);
    res.send({
      code: 305,
      message: 'You book is unable to be posted.'
    });
  });
  // udpate recentlyAdded
  let recentListPromise = await db.collection('RecentlyAdded').doc('Books').get().then(function(documentSnapShot) {
    var tempRecentTitles = documentSnapShot.data();
    let tempBookMajor = bk_major.toUpperCase();
    if(tempRecentTitles === undefined) {
      db.collection('RecentlyAdded').doc('Books').set({
        RecentTitles: [`${bookSchool}_${tempBookMajor}_${bk_id}_A`]
      }).then(function() {
        console.log('RecentTitles added.');
      });
    }
    else {
      var newTitle = `${bookSchool}_${tempBookMajor}_${bk_id}_A`;
      var updateTitles = documentSnapShot.data().RecentTitles;
      updateTitles.push(newTitle);
      db.collection('RecentlyAdded').doc('Books').update({
        RecentTitles: updateTitles
      }).then(function() {
        console.log('RecentTitles updated');
      });
    }
  });
  // upload image
  // if(imageFile) {
  //   uploadImageToStorage(req, bk_school, bk_major, bk_id).then((success) => {
  //     console.log('Image upload successful.');
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }
}

// upload image to Google Storage
// async function uploadImageToStorage(req, bk_school, bk_major, bk_id) {
//   let form = new formidable.IncomingForm();
//   // formidable error handler
//   form.on('error', function(err) {
//     console.log(err);
//   });
//   console.log('@@@@@@@@@@@@@@@@@@@@');
//   form.parse(req, function(err, fields, files) {
//     let filename = `${files.image.name}_${Date.now()}`;
//     console.log('#########################');
//     console.log('filename: ' + filename);
//     let fileUploading = bucket.file(filename);
//     let url = '';
//     // establish writable stream to upload file
//     const stream = fileUploading.createWriteStream({
//       metadata: {
//         contentType: imageFile.mimetype
//       },
//       resumable: false
//     });
//     // error handler
//     stream.on('error', (err) => {
//       imageFile.cloudStorageError = err;
//       next(err);
//     });
//     stream.on('finish', () => {
//       imageFile.cloudStorageObject = filename;
//       fileUploading.makePublic().then(() => {
//         imageFile.cloudStoragePublicUrl = getPublicUrl(filename);
//         // update url and bk doc
//         url = format(`https://storage.googleapis.com/${bucket.name}/${fileUploading.name}`);
//         db.collection('Books').doc(bk_school).collection(bk_major).doc(bk_id).update({
//           Image: url
//         }).then(function() {
//           console.log('url update successful');
//         });
//         next();
//       });
//     })
//   });
// }

// fetch myBook list
router.post('/my_book', function(req, res) {
  var meInfo = req.body;
  var me_id = meInfo.me_id;
  console.log('user id in aboutMe: ' + me_id);
  // query db
  var list = [];
  db.collection('Users').doc(me_id).collection('Sell').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      list.push(doc.data());
      console.log(list);
    });
    // send res
    res.send({
      code: 300,
      list: list
    });
  }).catch(function(error) {
    // error in query
    console.log(error);
  });
})
// fetch my pending book list
router.post('/my_pending_book', function(req, res) {
  fetchPendingBooks(req, res);
});

async function fetchPendingBooks(req, res) {
  var me_id = req.body.me_id;
  // fetch all books in 'Buy'
  var list = [];
  let listPromise = await db.collection('Users').doc(me_id).collection('Buy').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      list.push(doc.data());
    });
    console.log(list);
    res.send({
      code: 300,
      list: list
    });
  }).catch(function(error) {
    res.send({
      code: 301,
      error: error,
      message: 'Something goes wrong when fetch the list ...'
    });
  });
}
// search book by name
router.post('/searchbook_name', function(req, res) {
  fetchBookListByName(req, res);
})

async function fetchBookListByName(req, res) {
  var searchInfo = req.body;
  var key = searchInfo.key;
  var bk_searchList = [];
  var sclList = [];
  var sclPromise = await db.collection('Books').get();
  sclPromise.forEach(function(doc) {
    sclList.push(doc.id);
  });
  const promiseToWait = [];
  const docPromiseToWait = [];
  sclList.forEach(function(scl) {
    // bk found for each school
    var bk_list = [];
    var titlePromise = db.collection('Books').doc(scl).get().then(function(snapshot) {
      //console.log(snapshot.data().Titles);
      var list = snapshot.data().Titles;
      list.forEach(function(bk_str) {
        // parse bk_str
        var subStrings = bk_str.split('_');
        var bk_name = subStrings[0];
        var bk_major = subStrings[1];
        var bk_id = subStrings[2];
        // if bk_name contains key
        if(bk_name.includes(key)) {
          bk_list.push(`${bk_major}_${bk_id}`);
        }
      });
      console.log(bk_list);
      bk_list.forEach(function(value) {
        //console.log('found');
        var major = value.split('_')[0];
        var id = value.split('_')[1];
        console.log('PUSHING BOOK...');
        let docPromise = db.collection('Books').doc(scl).collection(major).doc(id).get().then(function(doc) {
          // check if book is available
          if(doc.data().Status === 'A') {
            bk_searchList.push(doc.data());
          }
          //console.log(bk_searchList);
        });
        docPromiseToWait.push(docPromise);
      });
    });
    promiseToWait.push(titlePromise);
  });
  // promise chain
  const response = await Promise.all(promiseToWait);
  const docResponse = await Promise.all(docPromiseToWait);
  //console.log(sclList);
  // db.collection('BOOK').get().then(function(snapshot) {
  //   snapshot.forEach(function(doc) {
  //     sclList.push(doc.id);
  //   });
  // });
  // console.log(sclList);
  //console.log(bk_searchList);
  console.log(bk_searchList);
  res.send({
    code: 300,
    list: bk_searchList
  });
}
// search book by course
router.post('/searchbook_school_course', function(req, res) {
  fetchBookListByCourse(req, res);
});

async function fetchBookListByCourse(req, res) {
  let scl = req.body.key_scl;
  let course = req.body.key_course;
  let major = req.body.key_major;
  console.log(scl + '+' + course + '+' + major);
  let list = [];
  let listPromise = await db.collection('Books').doc(scl).collection(major).where('Course_Number', '==', course)
  .get()
  .then(function(documentSnapShot) {
    documentSnapShot.forEach(function(doc) {
      list.push(doc.data());
    });
  });
  res.send({
    code: 300,
    list: list
  });
}
// book details
router.post('/book_details', function(req, res) {
  bookDetailsHandler(req, res);
});

async function bookDetailsHandler(req, res) {
  var bookInfo = req.body;
  // seller_uid
  var uid = bookInfo.uid;
  var bk_id = bookInfo.bk_id;
  var bk_scl = bookInfo.bk_scl;
  var bk_major = bookInfo.bk_major;
  // get school and major for book search
  // let userPromise = await db.collection('Users').doc(uid).collection('Sell').doc(bk_id).get().then(function(documentSnapShot) {
  //   bk_scl = documentSnapShot.data().School;
  //   bk_major = documentSnapShot.data().Major;
  // });

  console.log('bk_scl: ' + bk_scl);
  console.log('bk_major: ' + bk_major);
  // search book
  var bkInfoPackage = null;
  let bkPromise = await db.collection('Books').doc(bk_scl).collection(bk_major).doc(bk_id).get().then(function(documentSnapShot) {
    bkInfoPackage = documentSnapShot.data();
  });
  console.log(bkInfoPackage);
  res.send({
    code: 300,
    message: bkInfoPackage
  });
}

// confirm trade
router.post('/trade_confirm', function(req, res) {
  tradeHandler(req, res);
});

async function tradeHandler(req, res) {
  let validateInfo = req.body;
  // check if the book is valid for trading
  let bk_school = validateInfo.bk_school;
  let bk_major = validateInfo.bk_major;
  let bk_id = validateInfo.bk_id;
  let seller_id = validateInfo.seller;
  let buyer_id = validateInfo.uid;
  let bk_name  = validateInfo.bk_name;
  let bk_price = validateInfo.bk_price;
  let bk_seller_username = validateInfo.bk_seller_username;
  let bk_seller_email = validateInfo.seller_email;
  let bk_extra_contact = validateInfo.bk_extra_contact;
  var status = '';

  console.log('SELLER ID: ' + seller_id);
  console.log('BUYER ID: ' + buyer_id );
  let statusPromise = await db.collection('Books').doc(bk_school).collection(bk_major).doc(bk_id).get().then(function(documentSnapShot) {
    status = documentSnapShot.data().Status;
  });
  const promiseToWait = [];
  var buyer_email = '';
  var buyer_username = '';
  var countOnBuyers = 0;
  // if book is available
  if(status === 'A' && seller_id !== buyer_id) {
    // set the status to N
    let change_status_promise = db.collection('Books').doc(bk_school).collection(bk_major).doc(bk_id).update({
      Status: 'N'
    }).then(function() {
      console.log('Book status has been udpated.');
    });
    promiseToWait.push(change_status_promise);
    // get buyer email and username
    let get_buyerInfo_promsie = db.collection('Users').doc(buyer_id).get().then(function(documentSnapShot) {
      buyer_email = documentSnapShot.data().Email;
      buyer_username = documentSnapShot.data().Username;
    });
    promiseToWait.push(get_buyerInfo_promsie);
    // get count on buyers
    let get_countOnBuyers_promise = db.collection('CountOnBuyers').doc(seller_id).get().then(function(documentSnapShot) {
      countOnBuyers = documentSnapShot.data().CountsOnBuyersAllTime;
    });
    // update recentTitles
    updateRecentTitles = [];
    let recentTitlePromise = await db.collection('RecentlyAdded').doc('Books').get().then(function(documentSnapShot) {
      updateRecentTitles = documentSnapShot.data().RecentTitles;
    });
    var recentTitleLength = updateRecentTitles.length;
    var recentItemIndex;
    var recentItemId;
    for(recentItemIndex = 0; recentItemIndex < recentTitleLength; recentItemIndex++) {
      tempStr = updateRecentTitles[recentItemIndex];
      recentItemId = updateRecentTitles[recentItemIndex].split('_')[2];
      if(recentItemId === bk_id) {
        updateRecentTitles[recentItemIndex] = tempStr.replace('_A', '_N');
        if(updateRecentTitles.length === 0) {
          db.collection('RecentlyAdded').doc('Books').delete().then(function() {
            console.log('RecentlyAdded deleted');
          });
        }
        break;
      }
    }
    db.collection('RecentlyAdded').doc('Books').update({
      RecentTitles: updateRecentTitles
    }).then(function() {
      console.log('Titles update successful');
    });
    // send res
    res.send({
      code: 300,
      message: 'The contact info has been saved. Please check in your profile page.'
    });
  }
  else if(status === 'N') {
    res.send({
      code: 301,
      message: 'Woops, the book has been booked by others. Go see another book :)'
    });
  }
  else if(seller_id === buyer_id) {
    res.send({
      code: 401,
      message: 'You cannot buy your own book'
    });
  }
  const response = await Promise.all(promiseToWait);
  if(buyer_email !== '' && buyer_username !== '') {
    // update seller doc
    db.collection('Users').doc(seller_id).collection('Sell').doc(bk_id).update({
      Email: buyer_email,
      Username: buyer_username,
      BuyerUID: buyer_id
    }).then(function() {
      console.log('seller doc udpated!');
    });
    // update buyer doc
    db.collection('Users').doc(buyer_id).collection('Buy').doc(bk_id).set({
      Bookname: bk_name,
      Email: bk_seller_email,
      ExtraContact: bk_extra_contact,
      Image: null,
      Price: bk_price,
      Username: bk_seller_username
    }).then(function() {
      console.log('buyer doc updated!');
    });
    // update count on buyers
    db.collection('CountOnBuyers').doc(seller_id).update({
      CountsOnBuyersAllTime: countOnBuyers + 1
    }).then(function() {
      console.log('count on buyers updated!');
    });
  }
}

// fetch buyer list
router.post('/buyer_list', function(req, res) {
  fetchBuyerList(req, res);
});

async function fetchBuyerList(req, res) {
  let uid = req.body.uid;
  let list = [];
  let listPromsie = await db.collection('Users').doc(uid).collection('Sell').where('Email', '>', '')
  .get()
  .then(function(documentSnapShot) {
    documentSnapShot.forEach(function(doc) {
      list.push(doc.data());
    });
    console.log(list);
    res.send({
      code: 300,
      message: list
    });
  });
}

// delete book
router.post('/delete_book', function(req, res) {
  deleteBookHandler(req, res);
});

async function deleteBookHandler(req, res) {
  let bk_scl = req.body.bk_scl;
  let bk_major = req.body.bk_major;
  let bk_id = req.body.bk_id;
  let uid = req.body.uid;
  let buyer_id = req.body.buyer_id;
  let mode = req.body.mode;
  let countOnBuyers = 0;
  let get_countOnBuyers_promise = await db.collection('CountOnBuyers').doc(uid).get().then(function(documentSnapShot) {
    countOnBuyers = documentSnapShot.data().CountsOnBuyersAllTime;
  });
  if(mode === 'deleteFromMyBuyersList') {
    // decrement counts on buyers
    db.collection('CountOnBuyers').doc(uid).update({
      CountsOnBuyersAllTime: countOnBuyers - 1
    }).then(function() {
      console.log('count on buyers updated!');
    });
  }
  // delete book doc
  db.collection('Books').doc(bk_scl).collection(bk_major).doc(bk_id).delete().then(function() {
    console.log('Book deleted from book doc!');
    res.send({
      code: 300,
      message: 'The book has been deleted.'
    });
  }).catch(function(error) {
    console.log('Error in deleting.')
  });
  // update titles
  updateTitles = [];
  let titlePromise = await db.collection('Books').doc(bk_scl).get().then(function(documentSnapShot) {
    updateTitles = documentSnapShot.data().Titles;
  })
  var arrayLength = updateTitles.length;
  var itemIndex;
  var itemId;
  for(itemIndex = 0; itemIndex < arrayLength; itemIndex++) {
    itemId = updateTitles[itemIndex].split('_')[2];
    if(itemId === bk_id) {
      updateTitles.splice(itemIndex, 1);
      // check if array is empty
      if(updateTitles.length === 0) {
        db.collection('Books').doc(bk_scl).delete().then(function() {
          console.log('School doc deleted.');
        });
      }
      break;
    }
  }
  db.collection('Books').doc(bk_scl).update({
    Titles: updateTitles
  }).then(function() {
    console.log('Titles update successful.');
  });
  // update user doc
  db.collection('Users').doc(uid).collection('Sell').doc(bk_id).delete().then(function() {
    console.log('Book deleted from user doc!');
  });
  if(buyer_id !== null) {
    db.collection('Users').doc(buyer_id).collection('Buy').doc(bk_id).delete().then(function() {
      console.log('Buyer info updated.');
    });
  }

  // update recentTitles
  updateRecentTitles = [];
  let recentTitlePromise = await db.collection('RecentlyAdded').doc('Books').get().then(function(documentSnapShot) {
    updateRecentTitles = documentSnapShot.data().RecentTitles;
  });
  var recentTitleLength = updateRecentTitles.length;
  var recentItemIndex;
  var recentItemId;
  for(recentItemIndex = 0; recentItemIndex < recentTitleLength; recentItemIndex++) {
    recentItemId = updateRecentTitles[recentItemIndex].split('_')[2];
    if(recentItemId === bk_id) {
      updateRecentTitles.splice(recentItemIndex, 1);
      if(updateRecentTitles.length === 0) {
        db.collection('RecentlyAdded').doc('Books').delete().then(function() {
          console.log('RecentlyAdded deleted');
        });
      }
      break;
    }
  }
  db.collection('RecentlyAdded').doc('Books').update({
    RecentTitles: updateRecentTitles
  }).then(function() {
    console.log('Titles update successful');
  });
}

// cancel transaction
router.post('/cancel_transac', function(req, res) {
  cancelTransactionHandler(req, res);
});

async function cancelTransactionHandler(req, res) {
  let uid = req.body.uid;
  let school = req.body.school;
  let major = req.body.major;
  let bookId = req.body.bookId;
  let buyerId = req.body.buyerId;
  let countOnBuyers = 0;
  // get count on buyers
  let get_countOnBuyers_promise = await db.collection('CountOnBuyers').doc(uid).get().then(function(documentSnapShot) {
    countOnBuyers = documentSnapShot.data().CountsOnBuyersAllTime
  });
  // decrement buyer counts
  db.collection('CountOnBuyers').doc(uid).update({
    CountsOnBuyersAllTime: countOnBuyers - 1
  }).then(function() {
    console.log('count on buyers updated!');
  });
  // update book status
  db.collection('Books').doc(school).collection(major).doc(bookId).update({
    Status: 'A'
  }).then(function() {
    console.log('Book status updated.');
  });
  // update 'Sell' info
  db.collection('Users').doc(uid).collection('Sell').doc(bookId).update({
    Email: null,
    Username: null,
    BuyerUID: null
  }).then(function() {
    console.log('Sell info updated.');
  });
  // update 'Buy' info
  db.collection('Users').doc(buyerId).collection('Buy').doc(bookId).delete().then(function() {
    console.log('Buyer info updated.');
    res.send({
      code: 300,
      message: 'The transaction has been canceled.'
    });
  });
}

// fetch default book list
router.post('/books_by_date', function(req, res) {
  handleBooksByDate(req, res);
});

async function handleBooksByDate(req, res) {
  let list = [];
  let promiseToWait = [];
  let recentAddedBooksList = [];
  let startingArrayIndex = 0;
  let recentAddedBooks = undefined;
  // await on promise
  let promise = await db.collection('RecentlyAdded').doc('Books').get().then(function(documentSnapShot) {
    recentAddedBooks = documentSnapShot.data();
    // if recentTitle undefined
    if(recentAddedBooks === undefined) {
      console.log('THE BOOK LIST NOW IS EMPTY');
    }
    else {
      recentAddedBooksList = recentAddedBooks.RecentTitles;
      if(recentAddedBooksList.length > 10) {
        startingArrayIndex = recentAddedBooksList.length - 10;
      }
      else {
        startingArrayIndex = 0;
      }
    }
  });

  if(recentAddedBooks !== undefined) {
    console.log(recentAddedBooksList);
    console.log(startingArrayIndex);

    for(var itemIndex = recentAddedBooksList.length - 1; itemIndex >= startingArrayIndex; itemIndex--) {
      var school = recentAddedBooksList[itemIndex].split('_')[0];
      var major = recentAddedBooksList[itemIndex].split('_')[1];
      var bkId = recentAddedBooksList[itemIndex].split('_')[2];
      var bookPromise = db.collection('Books').doc(school).collection(major).doc(bkId).get().then(function(documentSnapShot) {
        if(documentSnapShot.data().Status === 'A') {
          list.push(documentSnapShot.data());
        }
      });
      promiseToWait.push(bookPromise);
    }
    const response = await Promise.all(promiseToWait);
    console.log(list);
    res.send({
      code: 300,
      list: list
    });
  }
}

module.exports = router;
