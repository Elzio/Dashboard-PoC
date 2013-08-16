/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */
var mod;

mod = angular.module('infinite-scroll', [
    'o-utils'
]);

mod.directive('infiniteScroll', [
    '$rootScope', '$window', '$timeout', 'debounce', function($rootScope, $window, $timeout, debounce) {
        return {
            link: function(scope, elem, attrs) {
                var checkWhenEnabled, handler, handler_debounced, scrollDistance, scrollEnabled;
                scope.$el = elem;

                // Using some error margin instead of 0, sometimes the remaining value will be close to 0, preventing the callback to fire
                scrollDistance = 5;
                if (attrs.infiniteScrollDistance != null) {
                    scope.$watch(attrs.infiniteScrollDistance, function(value) {
                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function(value) {
                        scrollEnabled = !value;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return handler();
                        }
                    });
                }
                handler = function() {

                    var scrollHeight = scope.$el[0].scrollHeight,
                        clientHeight = scope.$el[0].clientHeight,
                        scrollTop =    scope.$el[0].scrollTop,
                        remaining =    scrollHeight - (clientHeight + scrollTop),
                        shouldScroll = remaining <= scrollDistance;

                    if (shouldScroll && scrollEnabled) {
                        if ($rootScope.$$phase) {
                            return debounce(scope.$eval(attrs.infiniteScroll));
                        } else {

                            return scope.$apply(attrs.infiniteScroll);
                        }
                    } else if (shouldScroll) {
                        return checkWhenEnabled = true;
                    }
                };

                handler_debounced = debounce(handler, 250, false);

                scope.$el.on('scroll', handler_debounced);
                scope.$on('$destroy', function() {
                    return scope.$el.off('scroll', handler_debounced);
                });
                return $timeout((function() {
                    if (attrs.infiniteScrollImmediateCheck) {
                        if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                            return handler_debounced();
                        }
                    } else {
                        return handler_debounced();
                    }
                }), 0);
            }
        };
    }
]);
