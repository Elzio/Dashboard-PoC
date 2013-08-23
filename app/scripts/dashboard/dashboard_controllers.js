var mod = angular.module('o-dashboard');

mod.controller('dashboardCtrl', [
    '$scope',
    'widgetService',
    'permissions_manager',
    function($scope, widgetService, permissions_manager) {
        var self = this;

        $scope.$watch(function() {
            return widgetService.getWidgets();
        }, function(newData, oldData) {
            if(newData === oldData || newData === undefined) return;
            $scope.widgets = _.map(newData, function(widget) {
                if(widget.views.length > 1) {
                    var allowedViews = [];
                    _.each(widget.views, function(view) {

                    });
                }


                return widget;

            });


        });

        $scope.addWidget = function() {
            var fakeWidget = {
                title:'Widget #' + ($scope.widgets.length + 1),
                grid: {
                    sizex: Math.floor(Math.random() * 4 + 1),
                    sizey: Math.floor(Math.random() * 4 + 1)
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
