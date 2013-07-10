(function($) {
    var extensions = {
        resize_widget_dimensions: function(options) {
            if (options.widget_margins) {
                this.options.widget_margins = options.widget_margins;
            }

            if (options.widget_base_dimensions) {
                this.options.widget_base_dimensions = options.widget_base_dimensions;
            }

            this.min_widget_width = Math.floor((this.options.widget_margins[0] * 2) + this.options.widget_base_dimensions[0]) - 1;
            this.min_widget_height = Math.floor((this.options.widget_margins[1] * 2) + this.options.widget_base_dimensions[1]) - 1;

            var serializedGrid = this.serialize();
            this.$widgets.each($.proxy(function(i, widget) {
                var $widget = $(widget);
                var data = serializedGrid[i];
                this.resize_widget($widget, data.sizex, data.sizey);
            }, this));

            this.generate_grid_and_stylesheet();
            this.get_widgets_from_DOM();
            this.set_dom_grid_height();
            return false;
        }
    };
    $.extend($.Gridster, extensions);
})(jQuery);

var mod = angular.module('o-dashboard');

mod.controller('gridsterCtrl', [
    '$window',
    '$scope',
    '$element',
    '$attrs',
    '$timeout',
    function($window, $scope, $element, $attrs, $timeout) {
        var self = this;


        self.$el = $($element);
        self.gridster = null;

        self.updateModel = function(event, ui) {
            var serializedGrid = self.gridster.serialize();
            angular.forEach($scope.widgets, function(widget, idx) {
                widget.grid = serializedGrid[idx];
            });
            $scope.$apply();
        };


        self.defaultOptions = {
            max_size_x: 12, // @todo: ensure that max_size_x match number of cols
            // options used by widget_resize_dimensions extension

            cols: 12,
            margin_ratio: 0.1,
            resize_time: 500,

            serialize_params: function($w, wgd) {
                return {
                    col: wgd.col,
                    row: wgd.row,
                    sizex: wgd.size_x,
                    sizey: wgd.size_y
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

        function calculateNewDimensions() {
            var containerWidth = self.$el.innerWidth();
            var newMargin = Math.floor(containerWidth * self.options.margin_ratio / (self.options.cols * 2));
            var newSize = Math.floor(containerWidth * ( 1 - self.options.margin_ratio) / self.options.cols);
            return [[newSize, newSize], [newMargin, newMargin]];
        }

        self.resizeWidgetDimensions = function() {
            // Calculate widget dimension proportional to parent dimension.
            var newDimensions = calculateNewDimensions();

            // Set new "fluid" widget dimensions
            self.gridster.resize_widget_dimensions({
                widget_base_dimensions: newDimensions[0],
                widget_margins: newDimensions[1]
            });
            self.updateModel();
        };


        self.hookWidgetResizer = function() {
            self.resizeWidgetDimensions();
            // Debounce
            $($window).on('resize', function() {
                $window.clearTimeout(self.resizeTimer);
                self.resizeTimer = $window.setTimeout(function() {
                    self.resizeWidgetDimensions();
                }, self.options.resize_time);
            });
        };


        $scope.$watch('widgets.length', function(newValue, oldValue) {
            if (newValue === oldValue) return;
//            if (newValue !== oldValue+1) return; //not an add

            // Added a widget
            if( newValue === oldValue+1 ) {
                $timeout(function() {
                    var li = self.$el.find('ul').find('li').last()
                    self.attachElementToGridster(li);
                });
            }else {
                // Removed a widget
//                self.resizeWidgetDimensions();
            }

        });

        $scope.removeWidget = function(widget) {
            var id = widget.id;

            var $li = self.$el.find('[data-widget-id="'+ id +'"]');

            $li.fadeOut('slow', function() {
                self.gridster.remove_widget($li, function() {
                    $scope.onremove({widget:widget});
                    self.resizeWidgetDimensions();
                });
            });
        };
    }
]);

mod.directive('gridster', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'AC',
            scope: {
                widgets: '=',
                onremove: '&'
            },
            templateUrl: 'templates/gridster.html',
            controller: 'gridsterCtrl',
            link: function(scope, elm, attrs, ctrl) {
                scope.initGrid = function() {
                    $timeout(function() {
                        var $ul = ctrl.$el.find('ul');
                        ctrl.gridster = $ul.gridster(ctrl.options).data('gridster');
                        ctrl.hookWidgetResizer();
                        scope.$broadcast('gridReady');
                    });
                };
            }
        };
    }
]);

mod.directive('widget', [
    '$timeout',
    'uuid',
    function($timeout, uuid) {
        return {
            restrict: 'A',
            require: '^gridster',
            scope: {
                remove: '&',
                widget: '='
            },
            link: function(scope, element, attrs, ctrl) {
                var $el = $(element);

                if(scope.widget.id === undefined) {
                    console.log(scope.widget.id = uuid.generate());
                }

                scope.$on('gridReady', function(event) {
                    var base_size = ctrl.gridster.options.widget_base_dimensions;
                    var margins = ctrl.gridster.options.widget_margins;

                    $el.resizable({
                        grid: [base_size[0] + (margins[0] * 2), base_size[1] + (margins[1] * 2)],
                        animate: false,
                        containment: ctrl.$el,
                        autoHide: false,
                        start: function(event, ui) {
                            ctrl.resizeWidgetDimensions()
                            var base_size = ctrl.gridster.options.widget_base_dimensions;
                            var margins = ctrl.gridster.options.widget_margins;

                            element.resizable('option', 'grid', [base_size[0] + (margins[0] * 2), base_size[1] + (margins[1] * 2)]);
                        },
                        stop: function(event, ui) {
                            setTimeout(function() {
                                sizeToGrid($el);
                                ctrl.updateModel();
                            }, 300);
                        }
                    });

                    $('.ui-resizable-handle, .no-drag, .disabled, [disabled]', $el).hover(function() {
                        ctrl.gridster.disable();
                    }, function() {
                        ctrl.gridster.enable();
                    });
                });



                function sizeToGrid($el) {
//                    ctrl.resizeWidgetDimensions()

                    var base_size = ctrl.gridster.options.widget_base_dimensions;
                    var margins = ctrl.gridster.options.widget_margins;

                    var w = Math.floor($el.width() - base_size[0]);
                    var h = Math.floor($el.height() - base_size[1]);


                    // Calculate both Width and Height in terms of number of rows and columns
                    for (var grid_w = 1; w > 0; w -= Math.floor((base_size[0] + (margins[0] * 2)))) {
                        grid_w++;
                    }

                    for (var grid_h = 1; h > 0; h -= Math.floor((base_size[1] + (margins[1] * 2)))) {
                        grid_h++;
                    }

                    // Remove inline styles added by resizable during resize,
                    // to give back "control" to gridster's stylesheets
                    $el.css({
                        width: '',
                        height: '',
                        top: '',
                        left: '',
                        position: ''
                    });

                    // Tell gridster to resize the widget through its own api
                    ctrl.gridster.resize_widget($el, grid_w, grid_h);

                }
            }
        };
    }
]);
