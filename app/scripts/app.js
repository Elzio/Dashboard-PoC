'use strict';
var mod = angular.module('DashboardPoCApp', [
    'o-utils',
    'o-dashboard'
]);

mod.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
