// 'use strict';

(function () {
angular
.module('sentimentalApp')
.controller('subrController',
	['$scope','$resource',
	function ($scope, $resource) {
		var Subreddit = $resource('/api/subreddit/:subId');
		// var Posts = $resource('api/subreddit/:subId');

		$scope.showPosts = [];
		$scope.postData = [];
		$scope.subrSearch = {};

		$scope.sortType;
		$scope.sortReverse = true;
		$scope.redditUrl = "http://www.reddit.com";

		$scope.anger=0.5;
		$scope.disgust = 0.3;
		$scope.fear = 0.6;
		$scope.joy = 0.2;
		$scope.sadness = 0.2;

		$scope.precision = 5;

		$scope.selectedSubr = {};
		$scope.cachedSubrs = [];

		$scope.apikey = "";

		$scope.calculating = false;


		$scope.getSubData = function () {
			console.log("Getting DATA");
			Subreddit.query(function (results) {
				$scope.subrList = results;
			});
		};

		$scope.useApiKey = function() {
			$http.post('/api/key', $scope.apikey)
                .success(function(data) {         
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
		}

		$scope.clearSearch = function() {
			$scope.subrSearch.name = "";
		}

		$scope.submitSearch = function() {
			if ($scope.loading) {
				console.log("already processing something!");
			} else {
				// verify that subreddit isn't in cache.
				var name = $scope.subrSearch.name;
				console.log($scope.filtered.length);
				console.log("search submitted");
				if(name) {
					console.log($scope.filtered);
					if ($scope.filtered.length === 1 && $scope.filtered[0].name.toUpperCase() === name.toUpperCase()) {
						console.log("ALREADY EXISTS, HOMIE");
						// TODO: refresh code
					} else {
						$scope.loading = true;
					
						var newSubr = new Subreddit({name: name, lastUpdated: Date.now()});

						// POST call to subreddit
						newSubr.$save(function(s, putResponseHeaders){
							console.log("save is done, I think");
							console.log(s);
							$scope.loading = false;
							$scope.getSubData();
							$scope.loadPosts(s._id);
						});	
					}
				} else {
					console.log("empty search!");
				}			
			}
		}

		$scope.loadPosts = function(id){
			console.log("Getting full data for sub id: " + id);

    		if (typeof $scope.cachedSubrs[id] === 'undefined') {
    			Subreddit.get({subId: id}, function (subr) {
    				console.log("results! " + subr);
    				$scope.cachedSubrs[id] = subr;
    				$scope.selectedSubr = $scope.cachedSubrs[id];
				});
    		} else {
    			console.log("returning cached posts!")
    			$scope.selectedSubr = $scope.cachedSubrs[id];	
    		}
		}

		// Chart stuff
		$scope.labels = ["Anger", "Disgust", "Fear", "Joy", "Sadness"];
		$scope.data = [
			[$scope.anger, $scope.disgust, $scope.fear, $scope.joy, $scope.sadness]
		];

		$scope.loadChart = function(post) {
			$scope.data = [
				[post.docAnger, post.docDisgust, post.docFear, post.docJoy, post.docSadness]
			];

			$scope.anger = post.docAnger; 
			$scope.disgust = post.docDisgust; 
			$scope.fear = post.docFear;
			$scope.joy = post.docJoy;
			$scope.sadness = post.docSadness;
		};

		$scope.datasets = [
	        {
	            label: "Post Emotion",
	            backgroundColor: "rgba(179,181,198,0.2)",
	            borderColor: "rgba(179,181,198,1)",
	            pointBackgroundColor: "rgba(179,181,198,1)",
	            pointBorderColor: "#fff",
	            pointHoverBackgroundColor: "#fff",
	            pointHoverBorderColor: "rgba(179,181,198,1)"
	        }
	    ];

		// initialize
		$scope.getSubData();	

	
	}]);
})();
