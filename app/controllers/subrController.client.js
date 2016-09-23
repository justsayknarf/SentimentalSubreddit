'use strict';

(function () {
angular
.module('sentimentalApp', ['ngResource'])
.controller('subrController',
	['$scope',
	'$resource',
	function ($scope, $resource) {
		var Subreddit = $resource('/api/subreddit');
		var Posts = $resource('api/subreddit/:subId');

		$scope.showPosts = [];
		$scope.postData = [];
		$scope.subrSearch = {};

		$scope.sortType;
		$scope.sortReverse = true;
		$scope.redditUrl = "http://www.reddit.com";

		$scope.getSubData = function () {
			console.log("Getting DATA");
			Subreddit.query(function (results) {
				$scope.subrList = results;
			});
		};

		$scope.showTopPosts = function(index, id) {
			console.log("index! " + index);
			if ($scope.showPosts[index] === 1) {
        		$scope.showPosts[index] = 0;
        	} else {
				console.log("Getting full data for sub id: " + id);
        		if (typeof $scope.postData[id] === 'undefined') {
        			console.log("Loading for first time...");
        			Posts.get({subId: id}, function (results) {
        				console.log("results! " + results);
						$scope.postData[id] = results;
					});
        		}

        		$scope.showPosts[index] = 1;
			}
		}

		$scope.searchSubreddit = function(query) {


		};

		$scope.addSubreddit = function(queryText) {
			console.log(queryText);

		};

		$scope.submitSearch = function() {
			// verify that subreddit isn't in database.
			if($scope.subrSearch.name) {
				var name = $scope.subrSearch.name;
				var newSubr = new Subreddit({name: name, lastUpdated: Date.now()});
				console.log("what's happening.");

				newSubr.$save(function(s, putResponseHeaders){
					console.log("save is done, I think");
					$scope.getSubData();
				});
				
				$scope.subrSearch.name = "";	
			
			} else {
				// console.log("empty search!");
			}			
		}

		// initialize
		$scope.getSubData();	

	
	}]);
})();
