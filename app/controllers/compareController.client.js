'use strict';

(function () {
angular
.module('sentimentalApp', ['ngResource', 'chart.js'])
.controller('compareController',
	['$scope',
	'$resource',
	function ($scope, $resource) {
		var Subreddit = $resource('/api/subreddit/:subId');
		// var Posts = $resource('api/subreddit/:subId');

		$scope.data = [];

		var emptySub = [0, 0, 0, 0, 0];

		// Chart stuff
		$scope.labels = ["Anger", "Disgust", "Fear", "Joy", "Sadness"];
		
		$scope.data[0] = emptySub;
		$scope.data[1] = emptySub;

		$scope.sub1 = emptySub;
		$scope.sub2 = emptySub;

		$scope.subrList = [];

		$scope.compare = [];

		$scope.getAllSubData = function () {
			console.log("Getting DATA");
			Subreddit.query(function (results) {
				results.forEach(function(result){ 
					$scope.subrList[result.name.toUpperCase()] = result;
				});

				var subreddit = $scope.subrList["ALL"];
				$scope.sub1 = [subreddit.docAnger, subreddit.docDisgust, subreddit.docFear, subreddit.docJoy, subreddit.docSadness];	
				$scope.data[0] =[subreddit.docAnger, subreddit.docDisgust, subreddit.docFear, subreddit.docJoy, subreddit.docSadness];	

				subreddit = $scope.subrList["SANFRANCISCO"];
				$scope.sub2 = [subreddit.docAnger, subreddit.docDisgust, subreddit.docFear, subreddit.docJoy, subreddit.docSadness];	
				$scope.data[1] =[subreddit.docAnger, subreddit.docDisgust, subreddit.docFear, subreddit.docJoy, subreddit.docSadness];	

			});
		};

		$scope.loadChart = function(index, subr) {
			if (subr === "empty") {
				$scope.data[index] = emptySub;
			} else {
				var subreddit = $scope.subrList[subr.toUpperCase()];
				$scope.data[index] = [subreddit.docAnger, subreddit.docDisgust, subreddit.docFear, subreddit.docJoy, subreddit.docSadness];	
			}
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

	    $scope.getSubData = function (subreddit) {
			console.log("Getting DATA");
			Subreddit.get({name: subreddit}, function (results) {
				$scope.subrList[subreddit.toUpperCase()] = results;
			});
		};

		$scope.submitSearch = function(ind){ 
			console.log("search");
			if (ind===1) {
				console.log("1");
				if($scope.subrList[$scope.subrSearch1]){
					var s = $scope.subrList[$scope.subrSearch1];
					$scope.sub1 = [s.docAnger, s.docDisgust, s.docFear, s.docJoy, s.docSadness];	
				}
			} else {
				console.log("2");
				if($scope.subrList[$scope.subrSearch2]){
					var s = $scope.subrList[$scope.subrSearch2];
					$scope.sub2 = [s.docAnger, s.docDisgust, s.docFear, s.docJoy, s.docSadness];	
				}
			}
		};

		$scope.submitSearch = function(ind){ 
			if($scope.subrList[$scope.compare[ind].toUpperCase()]) {
				var s = $scope.subrList[$scope.compare[ind].toUpperCase()];
				$scope.data[ind] = [s.docAnger, s.docDisgust, s.docFear, s.docJoy, s.docSadness];	
			}
		};
			
		// initialize
		$scope.getAllSubData();	

	
	}]);
})();
