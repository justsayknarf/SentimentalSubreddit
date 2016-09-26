var monggose = require("mongoose");
var request = require('request');

var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

var Subreddit = require("../models/subreddit");
var Post = require("../models/post");

var argv = require('minimist')(process.argv.slice(2));

var API_KEY = "";
var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');

var alchemy_language = new AlchemyLanguageV1({
	api_key: API_KEY
});



var RedditURL = "http://www.reddit.com"
var RedditParams = "/top.json?t=week&limit=20"

var parser = {};

// get and parse top 20 posts for the week in subreddit
parser.getTopRedditPosts = function(subreddit, callback) {
	var url = RedditURL + "/r/" + subreddit + RedditParams;
	request(url, function (error, resp, body) {
		if (!error && resp.statusCode == 200) {
			var redditResponse = JSON.parse(body);

			// return list of reddit posts.
			callback(redditResponse.data.children);
		}
	});
}

// take reddit post url, get back all comments text
parser.getRedditPost = function(post, callback) {
	var title = post.data.title;
	var url = RedditURL + post.data.permalink + ".json";
	var text = title + "\n";

	// get reddit post
	request(url, function(error, resp, body) {
		if (!error && resp.statusCode == 200) {
			// console.log("reddit post received: " + title);
			// console.log(RedditURL + post.data.permalink);
			var postResponse = JSON.parse(body);

			// parse out selftext
			var selftext = postResponse[0].data.children[0].data.selftext;
			text += selftext + "\n";

			// get comments JSON tree
			var commentsTree = postResponse[1].data.children;

			// pull out comments recursively
			commentsTree.forEach( function(comment) {
				var newComment = parser.parseCommentText(comment);
				text += newComment;
			});

			// return all comment text
			callback(text);
		}
	});
}	

 parser.parseCommentText = function(child) {
	 var parsedComments = "";
	 var commentText = child.data.body;
	 
	 parsedComments += commentText + "\n";
	 if (child.data.replies) {
		child.data.replies.data.children.forEach( function(reply) {  
		 parsedComments += parser.parseCommentText(reply);
	 }) ;
	} 
	return parsedComments;
}

parser.parseRedditPosts = function(posts, callback) {
	var counter = posts.length;
	posts.forEach( function(post) {
		parser.getRedditPost(post, function(text) {
			var url = RedditURL + post.data.permalink;

			var params = {
				text: text,
				extract: 'doc-emotion, doc-sentiment',
				showSourceText: 0
			};

			// get sentiment from text
			alchemy_language.combined(params, function (err, response) {

				if (err) {
					console.log('error:', err);
					callback(err)
				} else {
					console.log(post.data.title);
					console.log(post.data.permalink);

					// console.log(JSON.stringify(response, null, 2));
					var result = { 
						"title": post.data.title,
						"permalink": post.data.permalink,
						"sentiment": response
					}

					results.push(result);
					counter-=1;

					if (counter == 0){
						console.log("done receiving docsentiment/emotion");

						// return no error, results of sentiment and emotion call
						callback(null, results);
					}
				}
			});
		});
	});
}


function translateAndSaveToDb(results, subr, callback) {
	var counter = results.length;
	console.log("Got " + counter + " POSTS");

	var avgSenti = 0.0;
	var avgEmo = [];
	var posts = [];

	results.forEach( function(result, index) {
		var tempSent = result.sentiment.docSentiment;
		var tempEmotion = result.sentiment.docEmotions;
		var tempScore = "";
		var tempMixed = "";

		if (tempSent.type !== "neutral"){
			tempScore = tempSent.score;
			tempMixed = tempSent.mixed;
			avgSenti += parseFloat(tempSent.score);
		}

		var tempPost = {
			url: result.permalink,
			title: result.title,
			sentimentType: tempSent.type,
			sentimentScore: tempScore,
			sentimentMixed: tempMixed,
			docAnger: tempEmotion.anger,
			docDisgust: tempEmotion.disgust,
			docFear: tempEmotion.fear,
			docJoy: tempEmotion.joy,
			docSadness: tempEmotion.sadness
		}

		posts.push(tempPost);

		// create Posts to save to db
		Post.create( tempPost, function(err, newPost){
			
			// push Post obj ref to subreddit
			subr.posts.push(newPost);
			console.log("post " + index + " saved!");

			counter-=1;
			if(counter === 0) {
				// use posts array with full obj data to calculate averages.
				subr.sentimentScore = calculateAvgScore(posts);
				var avgEmo = calculateAvgEmo(posts);

				subr.docAnger = avgEmo.avgAnger;
				subr.docDisgust = avgEmo.avgDisgust;
				subr.docFear = avgEmo.avgFear;
				subr.docJoy = avgEmo.avgJoy;
				subr.docSadness = avgEmo.avgSadness;

				subr.save();
				console.log("subreddit saved!");
				callback(null, subr);
			}
		});
	});
}

parser.execSubredditRetrieval = function(subName, callback) {
	results = [];

	parser.getTopRedditPosts(subName, function(posts){
		var counter = posts.length;

		if(posts.length === 0) {
			callback({dne: 1});
		}

		Subreddit.create({
								name: subName,
								lastUpdated: Date.now()
							}, 
		function(err, subreddit) {
			if (err) {
				console.log("subName " + subName + " couldn't be created for some reason");
			} else {
				parser.parseRedditPosts(posts, function(err, results) {
					if (err || results.length === 0) {
						console.log(err);
						callback(err);
					} else {
						translateAndSaveToDb(results, subreddit, function(err, subreddit){
							callback(null, subreddit)
						});
					}
				});
			}
		});
	});
}

parser.calcAvgSentiEmo = function(subr, callback) {
	console.log("begin calculation");
	subr.sentimentScore = calculateAvgScore(subr.posts);
	console.log("avg score saved: " + subr.sentimentScore);

	var avgEmo = calculateAvgEmo(subr.posts);
	
	subr.docAnger = avgEmo.avgAnger;
	subr.docDisgust = avgEmo.avgDisgust;
	subr.docFear = avgEmo.avgFear;
	subr.docJoy = avgEmo.avgJoy;
	subr.docSadness = avgEmo.avgSadness;
	
	console.log("avg emotions saved: " + subr.avgAnger);
	
	subr.save(function(err, savedSubr){
		if(err) {
			console.log(err);
		} else {
			callback(savedSubr);	
		}
		
	});
}

// takes posts from Subreddit db object, returns average score
var calculateAvgScore = function(posts) {
	console.log("begin averaging score of posts:");
	var total = 0.0;

	posts.forEach(function(post) {
		if (post.sentimentType !== "neutral") {
			total += parseFloat(post.sentimentScore);	
		}
	});

	console.log("total is " + total);
	var avg = total / posts.length;
	console.log("avg score is " + avg);
	return avg;
}

var calculateAvgEmo = function(posts) {
	var avgEmo = {};
	avgEmo["avgAnger"] = 0.0;
	avgEmo["avgDisgust"] = 0.0;
	avgEmo["avgFear"] = 0.0;
	avgEmo["avgJoy"] = 0.0;
	avgEmo["avgSadness"] = 0.0;

	var length = parseFloat(posts.length);

	posts.forEach(function(post) {
		avgEmo["avgAnger"] += parseFloat(post.docAnger);   
		avgEmo["avgDisgust"] += parseFloat(post.docDisgust);
		avgEmo["avgFear"] += parseFloat(post.docFear);
		avgEmo["avgJoy"] += parseFloat(post.docJoy);
		avgEmo["avgSadness"] += parseFloat(post.docSadness);
	});

	// console.log("total: " + avgEmo["avgAnger"]);
	// console.log("length " + length);
	// console.log(typeof avgEmo["avgAnger"]);

	avgEmo["avgAnger"] /= length;
	avgEmo["avgDisgust"] = avgEmo["avgDisgust"] / length;
	avgEmo["avgFear"] = avgEmo["avgFear"] / length;
	avgEmo["avgJoy"] = avgEmo["avgJoy"] / length;
	avgEmo["avgSadness"] = avgEmo["avgSadness"] / length;

	// console.log("average: " + avgEmo["anger"]);

	return avgEmo;
}



// ======================
// Console
// ======================

var subreddit = "";
var results = [];

// if(argv._.length === 0) {
//    console.log("Please run parser with name of Subreddit!");
//    console.log("Ex: node parser.js SanFrancisco");
//    process.exit()
// }
// else {
//    subreddit = argv._[0] 
//    console.log("Grabbing top 20 /r/" + subreddit + " posts from the last week...");
// }


function test(){
 parser.getTopRedditPosts("SanFrancisco", function(posts) {
	var counter = posts.length;

	parser.parseRedditPosts(posts, function() {
				 // console.log("DONE... and the results:" )

				 if (results.length === 0) {
					console.log("NO RESULTS. SOMETHING PROBABLY WENT WRONG.");
				}

				results.forEach( function(result) {
					console.log("Title: " + result.title);
					console.log("permalink: " + result.permalink);
					console.log("Sentiment: " 
					 + result.sentiment.docSentiment.type 
					 + ", with a score of: " 
					 + result.sentiment.docSentiment.score);

				});
			});

	});
}

function testAlchemy(text) {
	var params = {
				text: text,
				extract: 'doc-emotion',
				showSourceText: 0
			};

	// get sentiment from text
	alchemy_language.combined(params, function (err, response) {

		if (err) {
			console.log('error:', err);
			callback(err)
		} else {
			console.log(response);
		}
	});
}



// initialize();
// testAlchemy("Can I make requests again yet?");

module.exports = parser;




