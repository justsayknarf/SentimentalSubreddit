var monggose = require("mongoose");
var request = require('request');

var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

var Subreddit = require("../models/subreddit");
var Post = require("../models/post");

var argv = require('minimist')(process.argv.slice(2));


var API_KEY = "5188ca56b0ba8514218671254116be6fc130ec6d";
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

// parse through JSON response for individual posts.
parser.getRedditPosts = function(error, resp, body) {
 if (!error && resp.statusCode == 200) {
  var redditResponse = JSON.parse(body);
  redditResponse.data.children.forEach( getAndParseRedditPost );
  callback(posts);
}
}


// take reddit post url, get back all comments text
parser.getAndParseRedditPost = function(post, callback) {
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

         // console.log("RETURNING..." + text);
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

parser.getAndParseRedditPosts = function(posts, callback) {
 var counter = posts.length;
 posts.forEach( function(post) {
  parser.getAndParseRedditPost(post, function(text) {
   var url = RedditURL + post.data.permalink;

   var params = {
     text: text,
     extract: 'doc-emotion, doc-sentiment',
     showSourceText: 0
   };

         // console.log(post.data.permalink);
         // console.log(text);   

         // get sentiment from text
         alchemy_language.combined(params, function (err, response) {
          if (err)
           console.log('error:', err);
         else {
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
                callback(results);
              }
            }
          });

         // console.log(text);
       });
});
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


var execSubredditRetrieval = function(subName, callback) {
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
      parser.getAndParseRedditPosts(posts, function(results) {
        // console.log("DONE... and the results:" )

        if (results.length === 0) {
          console.log("NO RESULTS. SOMETHING PROBABLY WENT WRONG.");
        }

        var counter = results.length;
        console.log("Got " + counter + " POSTS");

        results.forEach( function(result, index) {
          var tempSent = result.sentiment.docSentiment;
          var tempEmotion = result.sentiment.docEmotions;
          var tempScore = "";
          var tempMixed = "";

          if (tempSent.type !== "neutral"){
            tempScore = tempSent.score;
            tempMixed = tempSent.mixed;
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

          Post.create( tempPost, function(err, newPost){
            // console.log(JSON.stringify(result.sentiment));
            subreddit.posts.push(newPost);
            console.log("post " + index + " saved!");

            counter-=1;
            if(counter === 0) {
              subreddit.save();
              console.log("subreddit saved!");
              callback(null, subreddit);
            }
          });
        });
      });
    }
  });
});

}


function test(){
 parser.getTopRedditPosts("SanFrancisco", function(posts) {
  var counter = posts.length;

  parser.getAndParseRedditPosts(posts, function() {
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

// initialize();

module.exports = execSubredditRetrieval;




