'use strict';
var mod = angular.module('DashboardPoCApp', [
    'ajoslin.promise-tracker',
    'o-utils',
    'o-dashboard',
    'Profile'
]);

mod.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
