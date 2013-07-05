var mod = angular.module('o-dashboard');

mod.controller('gridsterCtrl', [
    '$scope',
    '$element',
    '$attrs',
    '$timeout',
    function($scope, $element, $attrs, $timeout) {
        var self = this;

        self.$el = $($element);
        self.gridster = null;

        self.defaultOptions = {
            widget_margins: [5, 5],
            widget_base_dimensions: [50, 50],
            extra_rows: 0,
            extra_cols: 0,
            max_cols: null,
            min_cols: 1,
            min_rows: 15,
            max_size_x: 6,
            max_size_6: 6,
            autogenerate_stylesheet: true,
            avoid_overlapped_widgets: true,
            serialize_params: function($w, wgd) {
                return {
                    col: wgd.col,
                    row: wgd.row,
                    width: wgd.size_x,
                    height: wgd.size_y
                }
            }
        };
        self.options = angular.extend(self.defaultOptions, $scope.$eval($attrs.options));
    }
]);

mod.directive('gridster', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'AC',
            scope: {
                widgets: '=',
                onRemove: '&'
            },
            templateUrl: 'templates/gridster.html',
            controller: 'gridsterCtrl',
            link: function(scope, elm, attrs, ctrl) {
                scope.initGrid = function() {
                    $timeout(function() {
                        var $ul = ctrl.$el.find('ul');
                        ctrl.gridster = $ul.gridster(ctrl.options).data('gridster');

                        ctrl.gridster.options.draggable.stop = function(event, ui) {
                            //update model
                            angular.forEach($ul.find('li'), function(item, index) {
                                var li = angular.element(item);
                                if (li.attr('class') === 'preview-holder') return;
                                var widget = scope.widgets[index];
                                widget.grid.row = li.attr('data-row');
                                widget.grid.col = li.attr('data-col');
                            });
                            $scope.$apply();
                        };
                    });

                }
            }
        };
    }
]);

mod.directive('widget', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'E',
            require: '^gridster',
            templateUrl: 'templates/widget.html',
            replace: true,
            scope: {
                remove: '&',
                widget: '='
            },
            link: function(scope, element, attrs, ctrl) {
                var $el = $(element);


            }
        }
    }
]);
