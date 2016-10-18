'use strict';

var express = require("express");
var router = express.Router();
var Subreddit = require("../models/subreddit");
var Post = require("../models/post");
var parser = require("../middleware/parser");
var middleware = require("../middleware/index");

// root route - GET all subreddits in db
// returns all subreddit info without posts.
router.get("/subreddit", function(req, res){
	console.log("HIT API GET ALL SUBREDDIT ROUTE");
	Subreddit.find({}, function(err, allSubrData){
        if(err){
            console.log(err);
        } else {
        	console.log(allSubrData);
            res.json(allSubrData);
        }
    });
});

// CREATE new subreddit, parses and retrieves all post info
router.post("/subreddit", middleware.isLoggedIn, function(req, res){
	console.log("POST ROUTE HIT - " + req.body.name);
	parser.execSubredditRetrieval(req.body.name, function(err, subreddit) {
		if(err) {
			console.log(err);
		} else {
			console.log(subreddit.name + " saved!");
			console.log(subreddit);

			res.json(subreddit);

		}
	});
});

// USE NEW API KEY
router.post("/key", function(req, res){
	console.log("POST APIKEY ROUTE HIT " + req.body.apikey);
	parser.setNewAPI(req.body.apikey, function(err) {
		if (err) {
			console.log(err);
			res.json({"status":"bad api key!"});
		} else {
			console.log("new api key accepted!");
			res.json({"status": "ok"});
		}
	});
})

// single subreddit GET route: returns subreddit object with posts populated
router.get("/subreddit/:id", function(req, res){
	console.log("HIT API GET ROUTE for posts, id: " + req.params.id);
	
	Subreddit.findById(req.params.id).populate("posts").exec(function(err, subData){
        if(err){
            console.log(err);
        } else {
        	res.json(subData);
        }
    });
});





// GET specific post data. Returns found post object.
router.get("/post/:id", function(req, res){
	console.log("GET specific post ID: " + req.params.id);
	Post.findById({_id: req.params.id}, function(err, foundPost){ 
		res.json(foundPost);
	});
})

module.exports = router;