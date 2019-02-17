// Define middleware functions for books
var express = require('express');
var router = express.Router();
var path = require('path');
var bk_searchList = [];

//let auth = require('../Database/auth');
let services = require('../Database/firebase');
let auth = services.auth;
let db = services.db;

router.post('/refresh_counts_diff', function(req, res) {
  let uid = req.body.uid;
  db.collection('CountOnBuyers').doc(uid).update({
    CountsDiff: 0
  }).then(function() {
    console.log('count diff zeroed!');
    res.send({
      code: 300,
      message: 'Count diff has been zeroed!'
    });
  });
})

module.exports = router;
