var mod = angular.module('o-dashboard');

mod.service('widgetService', [
    '$http',
    'permissions_manager',
    function($http, permissions_manager) {
        var self = this;

        $http.get('scripts/profile/widget_config.json').then(function(resp) {

            self.widgets = resp.data.result;
        });

        this.getWidgets = function() {
            return self.widgets;
        };

        this.removeWidget = function ( widget ) {
            var idx = data.indexOf(widget);
            data.splice(idx, 1);
        };

        this.addWidget = function ( widget ) {
//            data.push(widget);
        }

    }
]);
