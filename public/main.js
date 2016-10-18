// 'use strict';

(function () {

var app = angular.module('sentimentalApp', ['ngRoute', 'ngResource', 'chart.js']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/public/partials/index.html',
      controller: 'subrController'
    // })
    // .when('/login', {
    //   templateUrl: '/public/partials/login.html',
    //   controller: 'loginController',
    //   access: {restricted: true}
    // })
    // .when('/logout', {
    //   controller: 'logoutController'
    // })  
    // .when('/register', {
    //   templateUrl: 'partials/register.html',
    //   controller: 'registerController'
    })
    .when('/one', {
      template: '<h1>This is page one!</h1>'
    // })
    // .when('/two', {
    //   template: '<h1>This is page two!</h1>'
    // })
    // .when('/test', {
    //   templateUrl: 'partials/index.html',
    //   controller: 'subrController'
    // })
    // .otherwise({
    //   redirectTo: '/'
    });
});


// app.run(function ($rootScope, $location, $route, AuthService) {
//   $rootScope.$on('$routeChangeStart',
//     function (event, next, current) {
//       AuthService.getUserStatus()
//       .then(function(){
//         if (next.access.restricted && !AuthService.isLoggedIn()){
//           $location.path('/login');
//           $route.reload();
//         }
//       });
//   });
// });



})();
