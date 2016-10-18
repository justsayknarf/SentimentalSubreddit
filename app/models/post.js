var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	url: String,
	title: String,
	sentimentType: String,
	sentimentScore: String,
	sentimentMixed: String,
	docAnger: String,
	docDisgust: String,
	docFear: String,
	docJoy: String,
	docSadness: String
	// subreddit: {
	// 	type: mongoose.Schema.Types.ObjectId,
 //        ref: "Subreddit"
	// }
});

module.exports = mongoose.model("Post", postSchema);
