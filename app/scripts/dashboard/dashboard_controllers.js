var mod = angular.module('o-dashboard');

mod.controller('dashboardCtrl', [
    '$scope',
    'widgetService',
    function($scope, widgetService) {
        var self = this;

        $scope.widgets = widgetService.getWidgets();


        console.log('dashboardCtrl, widgets:', $scope.widgets);

        $scope.addWidget = function() {
            var fakeWidget = {
               title:'Widget #' + ($scope.widgets.length + 1),
               grid: {
                   row: Math.floor(Math.random() + 1),
                   col: Math.floor(Math.random() + 1),
                   sizex: Math.floor(Math.random() * 2 + 1),
                   sizey: Math.floor(Math.random() * 2 + 1)
               }
            };
            widgetService.addWidget(fakeWidget);
        };

        $scope.removeWidget = function(widget) {
            console.log('dashctrl remove', widget);
            widgetService.removeWidget(widget);
        };
    }
]);
