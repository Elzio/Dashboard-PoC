var mod = angular.module('o-dashboard');

mod.controller('dashboardCtrl', [
    '$scope',
    'widgetService',
    function($scope, widgetService) {
        var self = this;

        $scope.widgets = function() {
            return widgetService.getWidgets();
        };

        console.log('dashboardCtrl, widgets:', $scope.widgets());

        $scope.addWidget = function() {
            var fakeWidget = {
               title:'Widget #' + ($scope.widgets.length + 1),
               grid: {
                   row: Math.floor(Math.random()*5+1),
                   col: Math.floor(Math.random()*5+1),
                   sizex: Math.floor(Math.random()*5+1),
                   sizey: Math.floor(Math.random()*5+1)
               }
            };
            widgetService.addWidget(fakeWidget);
        };

        $scope.removeWidget = function(id) {
            widgetService.removeWidget(id);
        };
    }
]);
