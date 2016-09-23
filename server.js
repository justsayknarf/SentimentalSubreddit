'use strict';

var express     = require('express');
var mongoose    = require('mongoose');
var seeds      = require("./seeds.js");
var bodyParser  = require("body-parser");

var app = express();

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// requiring routes
var indexRoutes       = require("./app/routes/index.js"),
    apiRoutes         = require("./app/routes/apiRoutes.js");

var initialize            = require("./app/middleware/parser.js");

mongoose.connect('mongodb://localhost:27017/sentimentalsubreddit', function (err, db) {

  if (err) {
    throw new Error('Database failed to connect!');
  } else {
    console.log('MongoDB successfully connected on port 27017.');
  }

  app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
  app.use('/public', express.static(process.cwd() + '/public'));

  // use routes 
  app.use("/", indexRoutes);
  app.use("/api", apiRoutes);



  // seeds.fakeData();
  seeds.initialize();


  var port = 3000;
  app.listen(port, function () {
    console.log('Node.js listening on port ' + port + '...');
  });

});

