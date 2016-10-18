'use strict';

var path = process.cwd();
var express = require("express");
var router = express.Router();

var User = require("../models/user");
var passport = require("passport");

// root route
router.get("/", function(req, res){
	console.log("HIT INDEX ROUTE");
    res.sendFile(path + "/public/index.html");
});

router.get("/compare", function(req, res){
	console.log("HIT INDEX ROUTE");
    res.sendFile(path + "/public/index2.html");
});

router.get("/manage", function(req, res) {
	res.sendFile(path + "/public/manage.html");
})


// ===============
// HANDLE AUTH
// ===============


// show register form
router.get("/register", function(req, res){
    res.sendFile(path + "/public/register.html");
});

// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.status(500).json({
                err: err
            });
        }
        passport.authenticate("local")(req, res, function(){
            return res.status(200).json({
                status: 'Registration successful!'
            });
        });
        
    })
})

// // show login form
// router.get("/login", function(req, res){
//     console.log("GET login!")


//     res.sendFile(path + "/public/login.html");
// })

// handle login logic
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});


// logout route
router.get("/logout", function(req, res){
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
})

module.exports = router;


