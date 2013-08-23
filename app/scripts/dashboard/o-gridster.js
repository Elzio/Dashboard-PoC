(function($) {
    // Extensions from: https://github.com/ducksboard/gridster.js/pull/77
    var extensions = {
        // HACK - Overriding method See Comment Below
        generate_grid_and_stylesheet: function() {
            var aw = this.$wrapper.width();
            var ah = this.$wrapper.height();
            var max_cols = this.options.max_cols;

            var cols = Math.floor(aw / this.min_widget_width) +
                this.options.extra_cols;

            var actual_cols = this.$widgets.map(function() {
                return $(this).attr('data-col');
            }).get();

            //needed to pass tests with phantomjs
            actual_cols.length || (actual_cols = [0]);

            var min_cols = Math.max.apply(Math, actual_cols);

            // get all rows that could be occupied by the current widgets
            var max_rows = this.options.extra_rows;
            this.$widgets.each(function(i, w) {
                max_rows += (+$(w).attr('data-sizey'));
            });

            this.cols = Math.max(min_cols, cols, this.options.min_cols);

            if (max_cols && max_cols >= min_cols && max_cols < this.cols) {
                this.cols = max_cols;
            }

            this.rows = Math.max(max_rows, this.options.min_rows);

            this.baseX = ($(window).width() - aw) / 2;
            this.baseY = this.$wrapper.offset().top;

            // HACK
            // In addition to real implementation ->
            // Container width has to be undefined when gridster is first initialized
            // Draggable will then respond appropriately;
            this.container_width = null;

            if (this.options.autogenerate_stylesheet) {
                this.generate_stylesheet();
            }

            return this.generate_faux_grid(this.rows, this.cols);
        },
        // Overriding default add_style_tag function of gridster to add an extra attribute for propper cleanup
        add_style_tag: function(css) {
            var d = document;
            var tag = d.createElement('style');

            d.getElementsByTagName('head')[0].appendChild(tag);
            tag.setAttribute('type', 'text/css');

            // In addition to real implementation ->
            // Adding this attribute so we can clean them up later
            tag.setAttribute('generated-from', 'gridster');

            if (tag.styleSheet) {
                tag.styleSheet.cssText = css;
            }else{
                tag.appendChild(document.createTextNode(css));
            }

            this.$style_tags = this.$style_tags.add(tag);

            return this;
        },
        resize_widget_dimensions: function(options) {
            if (options.widget_margins) {
                this.options.widget_margins = options.widget_margins;
            }

            if (options.widget_base_dimensions) {
                this.options.widget_base_dimensions = options.widget_base_dimensions;
            }

            // Removed a -1 from both lines here -> ??
            this.min_widget_width = ((this.options.widget_margins[0] * 2) + this.options.widget_base_dimensions[0]);
            this.min_widget_height = ((this.options.widget_margins[1] * 2) + this.options.widget_base_dimensions[1]);

            this.$widgets.each($.proxy(function(i, widget) {
                var $widget = $(widget);
                this.resize_widget($widget);

            }, this));

            // In addition to real implementation ->
            // Removing old gridster stylesheet(s) before regenerating
            $("head [generated-from='gridster']:not(:last)").remove();

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
    'debounce',
    function($window, $scope, $element, $attrs, $timeout, debounce) {
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
            shift_larger_widgets_down: false,
            max_size_x: 10, // @todo: ensure that max_size_x match number of cols
            // options used by widget_resize_dimensions extension
            cols: 10,
            margin_ratio: 0.075,
            resize_delay: 500,
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
            var $w = li.addClass('gs_w').appendTo(self.gridster.$el);
            self.gridster.$widgets = self.gridster.$widgets.add($w);
            self.gridster.register_widget($w).add_faux_rows(1).set_dom_grid_height();
            $w.css('opacity', 1);
        };

        self.calculateNewDimensions = function() {
            var containerWidth = self.$el.innerWidth();
            var newMargin = Math.floor(containerWidth * self.options.margin_ratio / (self.options.cols * 2));
            var newSize = Math.floor(containerWidth * ( 1 - self.options.margin_ratio) / self.options.cols);

            return [[newSize, newSize], [newMargin, newMargin]];
        }

        self.resizeWidgetDimensions = function() {

            // Calculate widget dimension proportional to parent dimension.
            var newDimensions = self.calculateNewDimensions();

            // Set new "fluid" widget dimensions
            self.gridster.resize_widget_dimensions({
                widget_base_dimensions: newDimensions[0],
                widget_margins: newDimensions[1]
            });

            self.gridster.$widgets.each(function(i, w) {
                angular.element(w).scope().sizeContent();
            });

            self.updateModel();
        };


        self.hookWidgetResizer = function() {

            self.resizeWidgetDimensions();


            var handler = function(evt) {
                evt.preventDefault();
                self.resizeWidgetDimensions();
            };

            var debounced_handler = debounce(handler, self.options.resize_delay, false);
            $($window).on('resize', debounced_handler);
        };


        $scope.$watch('widgets.length', function(newValue, oldValue) {
            if (newValue === oldValue) return;
//            if (newValue !== oldValue+1) return; //not an add

            // Added a widget
            if( newValue === oldValue+1 ) {
                $timeout(function() {
                    var li = self.$el.find('ul').find('li').last();
                    self.attachElementToGridster(li);
                });
            }else {
                // Removed a widget
            }

        });

        $scope.removeWidget = function(widget) {
            var id = widget.id;

            var $li = self.$el.find('[data-widget-id="'+ id +'"]');

            $li.fadeOut('slow', function() {
                self.gridster.remove_widget($li, function() {
                    $scope.onremove({widget:widget});
                    self.updateModel();
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
                onremove: '&',
                datasource: '&'
            },
            templateUrl: 'templates/dashboard.html',
            controller: 'gridsterCtrl',
            link: function(scope, elm, attrs, ctrl) {

                $timeout(function() {
                    var $ul = ctrl.$el.find('ul');
                    ctrl.gridster = $ul.gridster(ctrl.options).data('gridster');
                    ctrl.hookWidgetResizer();
                    scope.$broadcast('gridReady');
                    ctrl.resizeWidgetDimensions();
                    elm.css('opacity', 1);
                });

            }
        };
    }
]);

mod.directive('widget', [
    '$timeout',
    'uuid',
    'profileService',
    function($timeout, uuid, profileService) {
        return {
            restrict: 'A',
            require: '^gridster',
            scope: {
                remove: '&',
                widget: '=',
                datasource: '='
            },
            controller: function($scope, $element, $attrs, $controller, profileService) {
                this.updateTemplate = function(templateUrl) {

                    $scope.widget.currentTemplate = templateUrl;
                }

                $scope.scrolled = function() {
                    console.log('--scrolled widget');
                };

            },
            link: function(scope, element, attrs, ctrl) {

                if(scope.widget.id === undefined) {
                    scope.widget.id = uuid.generate();
                }

                scope.sizeContent = function() {

                    var $content = element.find('.content');
                    var headerHeight= element.find('header').outerHeight();


                    $content.fadeOut('fast', function(){
                        scope.$broadcast('resize');
                        $timeout(function() {
                            $content.outerHeight(element.innerHeight() - headerHeight);
                            $content.fadeIn();
                        }, 300);
                    });


                };


                scope.$on('gridReady', function(event) {


                    $timeout( function() {
                        element.resizable({
                            animate: false,
                            autoHide: true,
                            start: function(event, ui) {
                                var newDimensions = ctrl.calculateNewDimensions();
                                var base_size = newDimensions[0];
                                var margins = newDimensions[1];

                                element.resizable('option', 'grid', [(base_size[0]) + ((margins[0]) * 2), (base_size[1]) + ((margins[1]) * 2)]);


                            },
                            create: function(event, ui) {
                                scope.sizeContent();
                            },

                            stop: function(event, ui) {
                                scope.sizeContent();
                                $timeout(function() {
                                    sizeToGrid(element);
                                    ctrl.updateModel();
                                }, 300);
                            }
                        });



                        $('.ui-resizable-handle, .no-drag, .content, .disabled, [disabled]', element).hover(function() {

                            ctrl.gridster.disable();
                            element.css('cursor', 'default');
                        }, function() {
                            ctrl.gridster.enable();
                            element.css('cursor', '');
                        });
                    });



                });



                function sizeToGrid(element) {
                    var newDimensions = ctrl.calculateNewDimensions();
                    var base_size = newDimensions[0];
                    var margins = newDimensions[1];
                    var el_w = element.width() + margins[0] * 2;
                    var el_h = element.height() + margins[1] * 2;

                    var grid_w = (el_w / (base_size[0] + margins[0] * 2));
                    var grid_h = (el_h / (base_size[1] + margins[0] * 2));



                    // Remove inline styles added by resizable during resize,
                    // to give back "control" to gridster's stylesheets
                    element.css({
                        width: '',
                        height: '',
                        top: '',
                        left: '',
                        position: ''
                    });

                    // Tell gridster to resize the widget through its own api
                    ctrl.resizeWidgetDimensions();
                    ctrl.gridster.resize_widget(element, grid_w, grid_h);
                }
            }
        };
    }
]);

mod.directive('widgetnav', [
    '$timeout',
    function($timeout){
        return {
            restrict: 'A',
            require: '^widget',
            templateUrl: 'templates/widgetnav.html',
            link: function(scope, elm, attrs, ctrl) {
                if(scope.widget.views.length <= 1) {
                    elm.remove();
                }


                var parent, selectBox, buttonGroup, titleWidth, headerWidth, availableWidth;


                parent = elm.parent();
                selectBox = elm.find('select').css('margin', '0 0 5px 0');
                buttonGroup = elm.find('.btn-group');

                scope.selectedView = scope.widget.views[0];


                function sizeHeader() {

                    titleWidth = elm.siblings().filter(':header').outerWidth();
                    headerWidth = parent.innerWidth();
                    availableWidth = headerWidth - titleWidth - 50;

                    scope.widget.showBtns = true;

                    if(buttonGroup.outerWidth() > availableWidth) {
                        selectBox.width(availableWidth);
                        scope.widget.showBtns = false;
                    }
                    elm.fadeIn();
                }

                $timeout( sizeHeader, 500 );

                parent.css({
                    position: 'relative'
                });

                elm.css({
                    top: '50%',
                    right: '10px',
                    marginTop: -selectBox.outerHeight() / 2  + 'px',
                    position: 'absolute'
                });

                scope.$on('resize', function() {
                    $timeout(sizeHeader, 500);
                });

                scope.$watch('selectedView', function(newVal, oldVal){
                    ctrl.updateTemplate(newVal.templateUrl);
                });

                scope.setView = function(view) {
                    scope.selectedView = view;
                }


            }
        };
    }
]);
