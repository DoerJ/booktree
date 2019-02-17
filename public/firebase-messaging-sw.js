// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

const config = {
  apiKey: "AIzaSyCTrBrg0x3MPKutFNELObzDA4VurqQwMeE",
  authDomain: "booktree-prj.firebaseapp.com",
  databaseURL: "https://booktree-prj.firebaseio.com",
  projectId: "booktree-prj",
  storageBucket: "booktree-prj.appspot.com",
  messagingSenderId: "891878464461"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  // var notificationTitle = 'You have a new message';
  var notificationTitle = payload.data.title;
  var notificationOptions = {
    // body: 'Your book has been ordered.'
    body: payload.data.body
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
