'use strict';

var express     = require('express'),
    mongoose    = require('mongoose'),
    seeds      = require("./seeds.js"),
    bodyParser  = require("body-parser"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    flash       = require("connect-flash"),
    User       = require("./app/models/user"),
    passportLocalMongoose = require("passport-local-mongoose");

var app = express();

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// requiring routes
var indexRoutes       = require("./app/routes/index.js"),
    apiRoutes         = require("./app/routes/apiRoutes.js");

var initialize            = require("./app/middleware/parser.js");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This is the secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// mongoose.connect('mongodb://knarf:sentiment@ds041546.mlab.com:41546/heroku_wkv6bcdp', function (err, db) {
mongoose.connect('mongodb://localhost:27017/', function (err, db) {

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

