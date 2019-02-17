import React, { Component } from 'react';
import { render } from 'react-dom';
import RoutesConfig from './Config/RoutesConfig';

let webNotification = require('simple-web-notification');
let services = require('./Database/firebase');
let firebase = services.firebase;
let messaging = firebase.messaging();

// FCM onMessage event
messaging.onMessage(function(payload) {
  console.log('Message received. ', payload);
  let notificationTitle = payload.data.title;
  let notificationBody = payload.data.body;
  // ...
  webNotification.showNotification(notificationTitle, {
        body: notificationBody,
        onClick: function onNotificationClicked() {
            console.log('Notification clicked.');
        },
        // duration of the notification window
        autoClose: 5000
    });
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return(
      <div>
        <RoutesConfig/>
      </div>
    );
  }
}

export default App;
