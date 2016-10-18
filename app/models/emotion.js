var mongoose = require('mongoose');

var emotionSchema = new mongoose.Schema({
	anger: String,
	disgust: String,
	fear: String,
	joy: String,
	sadness: String
	// subreddit: {
	// 	type: mongoose.Schema.Types.ObjectId,
 //        ref: "Subreddit"
	// }
});

module.exports = mongoose.model("Emotion", emotionSchema);
