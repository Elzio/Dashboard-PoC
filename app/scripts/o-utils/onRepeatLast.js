var utils = angular.module('o-utils');

utils.directive('onRepeatLast', [
    function() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var isLast = scope.$last || scope.$parent.$last;
                if (isLast) {
                    scope.$evalAsync(attrs.onRepeatLast);
                }
            }
        }
    }
]);
