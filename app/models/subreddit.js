var mongoose = require('mongoose');

var subredditSchema = new mongoose.Schema({
	name: { type:String, 
			unique: true },
	sentimentScore: String,
	docAnger: String,
	docDisgust: String,
	docFear: String,
	docJoy: String,
	docSadness: String,
	lastUpdated: Date,
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	}]
});

module.exports = mongoose.model("Subreddit", subredditSchema);