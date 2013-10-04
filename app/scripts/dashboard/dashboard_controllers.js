var mod = angular.module('o-dashboard');

mod.controller('dashboardCtrl', [
    '$scope',
	'$q',
    'widgetService',
    'permissions_manager',
    function($scope, $q, widgetService, permissions_manager) {
        var self = this,
			views_defer = $q.defer();

        $scope.widgets = [];

        $scope.$watch(
            function() {
                return widgetService.getWidgets();
            },
            function(newData, oldData) {
                if(newData === oldData || newData === undefined) return;

                _.each(newData, function(widget) {
                    var filteredViews = [];
                    _.each(widget.views, function(view, idx, arr) {
                        permissions_manager.getPermissions(view.id).then( function(perms){
							view.permissions = perms;

                            if(view.permissions.access === true) {
                                filteredViews.push(view);
                            }

							if(idx === arr.length - 1) {
								views_defer.resolve(filteredViews);
							}
                        });

                    });

					views_defer.promise.then(function(views) {
						widget.views = filteredViews;
						if(widget.views.length >= 1) $scope.widgets.push(widget);
					});
                });
			}
        );

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
