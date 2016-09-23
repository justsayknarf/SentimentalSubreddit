'use strict';

function SubrHandler(db) {
	// var subreddits = db.collection('subreddits');

	// this.getSubData = function (req, res) {
	// 	subreddits
	// 		.findOne(
	// 			{},
	// 			{ '_id': false },
	// 			function (err, result) {
	// 				if (err) {
	// 					throw err;
	// 				}

	// 				var subredditResults = [];

	// 				if (result) {
	// 					subredditResults.push(result);
	// 					res.json(subredditResults);
	// 				} else {
	// 					subreddits.insert({ 'name': "NONE FOUND" }, function (err) {
	// 						if (err) {
	// 							throw err;
	// 						}

	// 						clicks.findOne({}, {'_id': false}, function (err, doc) {
	// 							if (err) {
	// 								throw err;
	// 							}

	// 							subreddit.push(doc);
	// 							res.json(clickResults);
	// 						});

	// 					});

	// 				}
	// 			}
	// 		);
	// };

}

module.exports = SubrHandler;
