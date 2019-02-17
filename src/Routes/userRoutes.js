// Define middleware functions for users
var express = require('express');
var router = express.Router();
var path = require('path');

//let auth = require('../Database/auth');
let services = require('../Database/firebase');
let auth = services.auth;
let db = services.db;

// user registration
router.post('/register', function(req, res) {
  var userRegisterInfo = req.body;
  //console.log(userRegisterInfo);
  var email = userRegisterInfo.email;
  var password = userRegisterInfo.password;
  var username = userRegisterInfo.username;

  console.log('#####################');
  console.log('email: ' + email);
  console.log('password: ' + password);
  // signup using auth services
  auth.createUserWithEmailAndPassword(email, password).then(function() {
    // if register successful
    res.send({
      code: 200,
      message: 'The account has been created!'
    });
    // get current status of user
    var user = auth.currentUser;
    // send email verification
    user.sendEmailVerification().then(function() {
      // if email sent
      console.log('Email sent!');
    }).catch(function(err) {
      // if err
      console.log(err);
    });
    var uid = user.uid;
    // update user collection
    db.collection('Users').doc(uid).set({
      Email: email,
      Username: username
    }).then(function() {
      console.log('USER collection updated!');
    });
    // update buyer count collection
    db.collection('CountOnBuyers').doc(uid).set({
      CountsOnBuyersAllTime: 0,
      CountsOnBuyersLogOut: 0,
      CountsDiff: 0
    });
  }).catch(function(err) {
    // handle error
    var errMessage = err.message;
    var errCode = err.code;
    // if email address invalid
    switch(errCode) {
      case 'auth/invalid-email':
        console.log('Please enter a valid email.');
        break;
      case 'auth/email-already-in-use':
        console.log('This account has existed.');
        break;
      case 'auth/weak-password':
        console.log('Choose a stronger password.');
        break;
      default:
        break;
    }
    // res.send(err)
    res.send({
      code: 301,
      errCode: errCode,
      errMessage: errMessage
    });
  });
});

// user log in
router.post('/login', function(req, res) {
  loginHandler(req, res);
});

async function loginHandler(req, res) {
  var userLoginInfo = req.body;
  //console.log(userLoginInfo);
  var email = userLoginInfo.email;
  var password = userLoginInfo.password;
  var emailVerified;
  var uid;
  // login using auth service
  let authPromise = await auth.signInWithEmailAndPassword(email, password).then(function() {
    // auth obj
    var user = auth.currentUser;
    uid = user.uid;
    if(user) {
      // check if user email is verified
      emailVerified = user.emailVerified;
      // if email not verified
      if(!emailVerified) {
        res.send({
          code: 301,
          message: 'Please verified your email address.'
        });
      }
    }
    else {
      //
    }
  }).catch(function(err) {
    // if error
    // handle error
    var errMessage = err.message;
    var errCode = err.code;
    switch(errCode) {
      case 'auth/invalid-email':
        console.log('Invalid email address.');
        break;
      case 'auth/user-not-found':
        console.log('The account does not exist.');
        break;
      case 'auth/wrong-password':
        console.log('The password is incorrect.');
        break;
      default:
        break;
    }
    // res.send(err)
    res.send({
      code: 301,
      message: errMessage,
      errCode: errCode,
      errMessage: errMessage
    });
  });
  // get counts diff for buyers
  let countOnBuyers = 0;
  let countOnBuyersLogout = 0;
  let countDiff = 0;
  let getCountPromise = await db.collection('CountOnBuyers').doc(uid).get().then(function(documentSnapShot) {
    countOnBuyers = documentSnapShot.data().CountsOnBuyersAllTime;
    countOnBuyersLogout = documentSnapShot.data().CountsOnBuyersLogOut;
  });
  // get buyer counts diff
  let countsDiff = countOnBuyers - countOnBuyersLogout;
  // update count diff
  let getCountDiffPromise = await db.collection('CountOnBuyers').doc(uid).get().then(function(documentSnapShot) {
    countDiff = documentSnapShot.data().CountsDiff;
  });
  db.collection('CountOnBuyers').doc(uid).update({
    CountsDiff: countDiff + countsDiff
  }).then(function() {
    console.log('count diff updated!');
  });
  console.log('COUNTS DIFF: ' + countsDiff);
  if(emailVerified) {
    res.send({
      code: 300,
      message: 'You are now logged in!',
      uid: uid,
      email: email.replace('@', ''),
      buyerDiffCounts: countDiff + countsDiff
    });
    console.log('THE USER HAS SIGNED IN!');
  }
}

// log out
router.post('/logout', function(req, res) {
  logoutHandler(req, res);
});

async function logoutHandler(req, res) {
  let uid = req.body.uid;
  let countOnBuyers = 0;
  let get_countOnBuyers_promise = await db.collection('CountOnBuyers').doc(uid).get().then(function(documentSnapShot) {
    countOnBuyers = documentSnapShot.data().CountsOnBuyersAllTime;
  });
  // update count on buyers when logout
  db.collection('CountOnBuyers').doc(uid).update({
    CountsOnBuyersLogOut: countOnBuyers
  }).then(function() {
    console.log('count on buyers when logout updated!');
  });
  // sign out using auth service
  auth.signOut().then(function() {
    // if signout successful
    res.send({
      code: 400,
      message: 'You have been successfully signed out!'
    });
    // auth object
    var user = auth.currentUser;
    if(user) {
      //
    }
    else {
      console.log('THE USER HAS SIGNED OUT!');
    }
  }).catch(function(err) {
    // if signout error
  });
}

// reset password
router.post('/reset_password', function(req, res) {
  console.log('RESET PASSWORD!');
  var resetInfo = req.body;
  var email = resetInfo.email;
  auth.sendPasswordResetEmail(email).then(function() {
    // email sent
    res.send({
      code: 300,
      message: 'Password reset email has been sent'
    });
  }).catch(function() {
    // error
    res.send({
      code: 200,
      message: 'Unable to reset password'
    });
  });
});
// get registration token
router.post('/get_registration_token', function(req, res) {
  fetchRegistrationToken(req, res);
});

async function fetchRegistrationToken(req, res) {
  messaging.requestPermissions().then(function() {
    console.log('Notification permission granted.');
  }).catch(function(err) {
    console.log('Unable to get permission to notify.', err);
  });
}
// fetch username in 'Me'
router.post('/get_username_in_logout_prompt', function(req, res) {
  fetchUsername(req, res);
})
async function fetchUsername(req, res) {
  var uid = req.body.uid;
  console.log('UID: ' + uid);
  var username = '';
  let promise = await db.collection('Users').doc(uid).get().then(function(documentSnapShot) {
    username = documentSnapShot.data().Username;
  });
  res.send({
    code: 300,
    username: username
  });
}

// uid_publish
// router.post('/uid_publish', function(req, res) {
//   var uidInfo = req.body;
//   var u_id = uidInfo.uid;
//   var bk_id = uidInfo.bk_id;
//   var bk_school = uidInfo.bk_school;
//   var bk_major = uidInfo.bk_major;
//   var bk_price = uidInfo.bk_price;
//   var bk_date = Date.parse(uidInfo.bk_date);
//   var bk_name = uidInfo.bk_name;
//   console.log('u_id: ' + u_id + ' bk_id: ' + bk_id);
//   var dbCollection = 'USERS';
//   db.collection(dbCollection).doc(u_id).collection('SELL').doc(bk_id).set({
//     Book_Name: bk_name,
//     Book_Price: bk_price,
//     Book_Date: bk_date,
//     Book_School: bk_school,
//     Book_Major: bk_major
//   }).then(function() {
//     // if update successful
//     console.log('User collection updated!');
//     res.send({
//       code: 300,
//       message: 'USER collection has been updated.'
//     });
//   });
//
// });

module.exports = router;
