'use strict';

var express     = require('express'),
    mongoose    = require('mongoose'),
    seeds      = require("./seeds.js"),
    bodyParser  = require("body-parser"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

var app = express();

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// requiring routes
var indexRoutes       = require("./app/routes/index.js"),
    apiRoutes         = require("./app/routes/apiRoutes.js");

var initialize            = require("./app/middleware/parser.js");

// PASSPORT CONFIGURATION
// app.use(require("express-session")({
//     secret: "This is the secret",
//     resave: false,
//     saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


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
  // seeds.initialize();
  // seeds.calculate("SanFrancisco");
  // seeds.calculate("LosAngeles");
  // seeds.calculate("news");


  var port = 3000;
  app.listen(port, function () {
    console.log('Node.js listening on port ' + port + '...');
  });

});

