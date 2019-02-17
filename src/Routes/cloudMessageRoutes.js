var express = require('express');
var router = express.Router();
var path = require('path');
var services = require('../Database/firebase-admin');
var messaging = services.messaging;

router.post('/subscribe_to_topic', function(req, res) {
  subscribeToTopicHandler(req, res);
});

async function subscribeToTopicHandler(req, res) {
  let token = req.body.token;
  let topic = req.body.topic;
  console.log('Registration token: ' + token);
  messaging.subscribeToTopic(token, topic).then(function(response) {
    console.log('Successfully subscribed to the topic: ', response);
    res.send({
      code: 300,
      message: response
    });
  }).catch(function(err) {
    console.log('Unable to subscribe to the topic: ', err);
  });
}

// unsubscribe topic
router.post('/unsubscribe_to_topic', function(req, res) {
  unsubscribeTopTopicHandler(req, res);
});

async function unsubscribeTopTopicHandler(req, res) {
  let topic = req.body.topic;
  let token = req.body.registrationToken;
  messaging.unsubscribeFromTopic(token, topic)
  .then(function(response) {
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    console.log('Successfully unsubscribed from topic:', response);
    res.send({
      code: 300,
      message: 'Successfully unsubscribed from topic'
    });
  })
  .catch(function(error) {
    console.log('Error unsubscribing from topic:', error);
  });
}

module.exports = router;
