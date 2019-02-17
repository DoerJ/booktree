// configure firebase db
// firebase module
//const firebase = require('firebase');
const firebase = require('firebase');

// Initialize Firebase
// var config = {
//   apiKey: "AIzaSyCTrBrg0x3MPKutFNELObzDA4VurqQwMeE",
//   authDomain: "booktree-prj.firebaseapp.com",
//   databaseURL: "https://booktree-prj.firebaseio.com",
//   projectId: "booktree-prj",
//   storageBucket: "booktree-prj.appspot.com",
//   messagingSenderId: "891878464461"
// };

var config = {
  apiKey: "AIzaSyDd7qOzgO2aW5qDZjlCFjb2S9QOC6yaKwU",
    authDomain: "book-tree.firebaseapp.com",
    databaseURL: "https://book-tree.firebaseio.com",
    projectId: "book-tree",
    storageBucket: "book-tree.appspot.com",
    messagingSenderId: "401929812302"
}

firebase.initializeApp(config);

// initialize firestore
var db = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);
// initialize auth service
var auth = firebase.auth();

module.exports.db = db;
module.exports.auth = auth;
module.exports.firebase = firebase;
