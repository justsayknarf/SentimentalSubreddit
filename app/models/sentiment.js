var mongoose = require('mongoose');

var sentimentSchema = new mongoose.Schema({
	type: String,
	score: String,
	mixed: String
	// anger: String,
	// disgust: String,
	// fear: String,
	// joy: String,
	// sadness: String
	// subreddit: {
	// 	type: mongoose.Schema.Types.ObjectId,
 //        ref: "Subreddit"
	// }
});

module.exports = mongoose.model("Sentiment", sentimentSchema);
