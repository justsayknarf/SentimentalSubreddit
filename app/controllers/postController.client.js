'use strict';

(function () {
angular
.module("sentimentalApp", ["chart.js"])
.controller("RadarCtrl", function ($scope) {

	var Posts = $resource('api/post/:postId');
	$scope.labels: ["Anger", "Disgust", "Fear", "Joy", "Sadness"]

	$scope.loadChart = function(id) {
		Post.query({_id: id}, function(foundPost){
			$scope.anger = foundPost.docAnger;
			$scope.disgust = foundPost.docDisgust;
			$scope.fear = foundPost.docFear; 
			$scope.joy = foundPost.docJoy;
			$scope.sadness = foundPost.docSadness;
		});
	};

	$scope.data = [
		[$scope.anger, $scope.disgust, $scope.fear, $scope.joy, $scope.sadness]
	];
		    
	$scope.datasets: [
		        {
		            label: "Post Emotion",
		            backgroundColor: "rgba(179,181,198,0.2)",
		            borderColor: "rgba(179,181,198,1)",
		            pointBackgroundColor: "rgba(179,181,198,1)",
		            pointBorderColor: "#fff",
		            pointHoverBackgroundColor: "#fff",
		            pointHoverBorderColor: "rgba(179,181,198,1)",

		        }
		    ]
	};

	// var myRadarChart = new Chart(ctx, {
	//     type: 'radar',
	//     data: data,
	//     options: {
	//             scale: {
	//                 reverse: true,
	//                 ticks: {
	//                     beginAtZero: true
	//                 }
	//             }
	//     	}
	// });
);

});



