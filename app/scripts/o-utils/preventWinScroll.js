var utils = angular.module('o-utils');


utils.directive('preventWinScroll', [
    '$window',
    function($window) {
        var scroll_handler = function(evt, d) {

            var scrollTop = evt.currentTarget.scrollTop;
            var scrollHeight = evt.currentTarget.scrollHeight;
            var height = $(event.currentTarget).innerHeight();

            // No scrollbar present, do nothing
            if(scrollHeight === height) { return; }

            if((d > 0 && scrollTop === 0) || (d < 0 && scrollTop >= scrollHeight - height)) {
                evt.preventDefault();
            }
        };

        return {
            restrict: 'AC',
            link: function(scope, element, attrs) {
                element.bind('mousewheel', scroll_handler);
            }
        };
    }
]);
