var mod = angular.module('o-utils');

mod.directive('onRepeatLast', [
    function() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var isLast = scope.$last || scope.$parent.$last;

                if (isLast) {
                    scope.$eval(attrs.onRepeatLast);

                }
            }
        }
    }
]);
