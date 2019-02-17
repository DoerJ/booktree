const admin = require('firebase-admin');
const serviceAccount = require('../CloudStorage/keyfile');
// Initialize Firebase
var config = {
  credential: admin.credential.cert(serviceAccount),
  apiKey: "AIzaSyCTrBrg0x3MPKutFNELObzDA4VurqQwMeE",
  authDomain: "booktree-prj.firebaseapp.com",
  databaseURL: "https://booktree-prj.firebaseio.com",
  projectId: "booktree-prj",
  storageBucket: "booktree-prj.appspot.com",
  messagingSenderId: "891878464461"
};

admin.initializeApp(config);
var messaging = admin.messaging();

module.exports.messaging = messaging;
