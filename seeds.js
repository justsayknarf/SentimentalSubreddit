var monggose = require("mongoose");

var Subreddit = require("./app/models/subreddit");
var Post = require("./app/models/post");

var parse = require("./app/middleware/parser.js");

var seeds = {};

var data = [
    {
        name: "aww",
        lastUpdated: Date.now()
    },
     {
        name: "SanFrancisco",
        lastUpdated: Date.now()
    },
    {
        name: "LosAngeles",
        lastUpdated: Date.now()
    }
    
]

var samplePosts = [ {
            url: "https://www.reddit.com/r/aww/comments/53k7ah/took_my_dog_on_a_car_ride_this_is_how_he_chose_to/",
            title: "Took my dog on a car ride, this is how he chose to sit",
            type: "positive",
            score: "0.2",
            mixed: "1",
            anger: "1",
            disgust: "0.092776",
            fear: "0.070902",
            joy: "0.975093",
            sadness: "0.085199"
        }, 
        {
            url: "https://www.reddit.com/r/sanfrancisco/comments/53l6gb/caltrain_nails_their_response/",
            title: "Caltrain nails their response",
            type: "positive",
            score: "0.091",
            mixed: "1",
            anger: "1",
            disgust: "0.092776",
            fear: "0.070902",
            joy: "0.875093",
            sadness: "0.085199"
        },
        {
            url: "https://www.reddit.com/r/LosAngeles/comments/53hysk/parking_for_rams_games_hits_200_and_up_good_news/",
            title: "Parking for Rams games hits $200 and up — good news for mass transit backers",
            type: "negative",
            score: "-0.2",
            mixed: "1",
            anger: "1",
            disgust: "0.092776",
            fear: "0.070902",
            joy: "0.075093",
            sadness: "0.085199"
        }

        ]

var removeAll = function() {
    Subreddit.remove({}, function(err) {
        if (err){
            console.log(err);
        }
        Post.remove({}, function(err) {
            if (err){
                console.log(err);
            }
            console.log("removed all Posts!");
        });
        console.log("removed all Subreddits!");
    });
}

seeds.fakeData = function(){
    console.log("Running seed file");
    // Remove all data
    Subreddit.remove({}, function(err) {
        if (err){
            console.log(err);
        }
        console.log("removed all data!");
    });
        
    data.forEach(function(sub, i){
        console.log(sub);
        Subreddit.create(sub, function(err, subreddit){
            if(err){ 
                console.log(err);
            } else {
                console.log("added a subreddit");
                console.log(subreddit);
                Post.create(samplePosts[i], function(err, post) {
                    if (err) {
                              console.log(err);
                    } else {
                        subreddit.posts.push(post);
                        subreddit.save();
                        console.log("Created a post in subreddit");
                    }
                });

            }
        });
    });
}

seeds.initialize = function() {
    removeAll();

    var subName = "SanFrancisco";

    parse(subName, function(finishedSub) {
        console.log("finished ");
    });
}



module.exports = seeds;


