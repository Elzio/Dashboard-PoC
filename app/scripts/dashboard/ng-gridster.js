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

        self.updateModel = function(event, ui) {
            var $ul = self.$el.find('ul');
//                    update model
            angular.forEach($ul.find('li'), function(item, index) {
                var li = angular.element(item);
                if (li.attr('class') === 'preview-holder') return;
                var widget = $scope.widgets[index];
                widget.grid.row = li.attr('data-row');
                widget.grid.col = li.attr('data-col');
            });
            $scope.$apply();
        };


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
            },
            draggable: {
                stop: self.updateModel
            }
        };
        self.options = angular.extend(self.defaultOptions, $scope.$eval($attrs.options));


        self.attachElementToGridster = function(li) {
            //attaches a new element to gridster
            var $w = li.addClass('gs_w').appendTo(self.gridster.$el).hide();
            self.gridster.$widgets = self.gridster.$widgets.add($w);
            self.gridster.register_widget($w).add_faux_rows(1).set_dom_grid_height();
            $w.fadeIn();
        };

        $scope.$watch('widgets.length', function(newValue, oldValue) {
            if (newValue === oldValue) return;
            if (newValue !== oldValue+1) return; //not an add



            $timeout(function() {
                var li = self.$el.find('ul').find('li').last()
                self.attachElementToGridster(li);
            }); //attach to gridster
        });
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
                        ctrl.updateModel();
                    });
                };
            }
        };
    }
]);

mod.directive('widget', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            require: '^gridster',
            scope: {
                remove: '&',
                widget: '='
            },
            link: function(scope, element, attrs, ctrl) {
                var $el = $(element);

                $el.resizable({
                    grid: [ctrl.options.widget_base_dimensions[0] + (ctrl.options.widget_margins[0] * 2), ctrl.options.widget_base_dimensions[1] + (ctrl.options.widget_margins[1] * 2)],
                    animate: false,
                    minWidth: ctrl.options.widget_base_dimensions[0],
                    minHeight: ctrl.options.widget_base_dimensions[1],
                    containment: ctrl.$el,
                    autoHide: true,
                    stop: function(event, ui) {
                        setTimeout(function() {
                            sizeToGrid($el);
                        }, 300);
                    }
                });

                $('.ui-resizable-handle', $el).hover(function() {
                    ctrl.gridster.disable();
                }, function() {
                    ctrl.gridster.enable();
                });

                function sizeToGrid($el) {
                    var base_size = ctrl.options.widget_base_dimensions;
                    var margins = ctrl.options.widget_margins;

                    var w = $el.width() - base_size[0];
                    var h = $el.height() - base_size[1];


                    for (var grid_w = 1; w > 0; w -= (base_size[0] + (margins[0] * 2))) {
                        grid_w++;
                    }

                    for (var grid_h = 1; h > 0; h -= (base_size[1] + (margins[1] * 2))) {
                        grid_h++;
                    }

                    ctrl.gridster.resize_widget($el, grid_w, grid_h);
                }
            }
        };
    }
]);
