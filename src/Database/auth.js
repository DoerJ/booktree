// configure auth services
//import { auth } from './firebase';
let services = require('./firebase');
let auth = services.auth;

// registration service
const registerAccountWithEmailAndPassword = (email, password) => {
  auth.createUserWithEmailAndPassword(email, password);
};

// login service
const loginAccountWithEmailAndPassword = (email, password) => {
  auth.signInWithEmailAndPassword(email, password).catch(function(err) {
    // handle error
    var errMessage = err.message;
    var errCode = err.code;

    // if email address invalid
    switch(errCode) {
      case 'auth/invalid-email':
        console.log('Email address is invalid.');
        break;
      case 'auth/user-disabled':
        console.log('Your account has been blocked.');
        break;
      case 'auth/user-not-found':
        console.log('Your account is not found. Please try again.');
        break;
      case 'auth/wrong-password':
        console.log('The password is incorrect.');
        break;
      default:
        break;
    }
  });
}

// logout service
const logoutAccount = () => {
  auth.signOut().then(function() {
    // if logout successful
  }).catch(function(err) {
    //handle error
    var errMessage = err.message;
    console.log(errMessage);
  });
}

// export {
//   registerAccountWithEmailAndPassword,
//   loginAccountWithEmailAndPassword,
//   logoutAccount
// };

module.exports.registerAccountWithEmailAndPassword = registerAccountWithEmailAndPassword;
module.exports.loginAccountWithEmailAndPassword = loginAccountWithEmailAndPassword;
module.exports.logoutAccount = logoutAccount;
