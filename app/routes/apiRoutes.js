'use strict';

var express = require("express");
var router = express.Router();
var Subreddit = require("../models/subreddit");
var parse = require("../middleware/parser");

// root route
router.get("/subreddit", function(req, res){
	console.log("HIT API ROUTE");
	Subreddit.find({}, function(err, allSubrData){
        if(err){
            console.log(err);
        } else {
        	console.log(allSubrData);
            res.json(allSubrData);
        }
    });
});

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

router.post("/subreddit", function(req, res){
	
	console.log("POST ROUTE HIT - " + req.body.name);
	parse(req.body.name, function(err, subreddit) {
		if(err) {
			console.log("subreddit doesn't exist!");
		} else {
			console.log(subreddit.name + " saved!");
			console.log(subreddit);
			res.json(subreddit);
		}
	});

});

module.exports = router;