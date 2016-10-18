var monggose = require("mongoose");
var request = require('request');

var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

var Subreddit = require("../models/subreddit");
var Post = require("../models/post");

middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        console.log(req.user);
        return next();
    }
    console.log("not logged in!")
    // req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;

