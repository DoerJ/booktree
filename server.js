var express = require('express');
var path = require('path');
var app = express();

// servered up with all content in root dir
app.use(express.static(__dirname + '/'));

// cookie and session
var session = require('express-session');
var cookieParser = require('cookie-parser');
// add cookie and session to the middleware stack
app.use(cookieParser());

var bodyParser = require('body-parser');
// add parser to the middleware stack
app.use(bodyParser.json());

//localhost:3000/user
var user = require('./src/Routes/userRoutes');
// localhost:3000/book
var book = require('./src/Routes/bookRoutes');
// localhost:3000/upload
var upload = require('./src/Routes/gsRoutes');
// localhost:3000/message
var message = require('./src/Routes/cloudMessageRoutes');
// localhost:3000/buyer
var buyer = require('./src/Routes/buyerRoutes');

// resolve cross-domain issue
// app.all() disregard the execution order of the middleware functions
// called whenever app.router middleware is reached
// *: all paths
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use('/user', user);
app.use('/book', book);
app.use('/upload', upload);
app.use('/message', message);
app.use('/buyer', buyer);

// listening on port 3000
app.listen(3000, function() {
  console.log('Listening on port 3000 ...');
})
