var mod = angular.module('o-utils');


mod.directive('preventWinScroll', [
    '$window',
    function($window) {

        var scroll_handler = function(evt, d) {
            var scrollHeight = evt.currentTarget.scrollHeight,
                clientHeight = evt.currentTarget.clientHeight,
                scrollTop =    evt.currentTarget.scrollTop,
                remaining =    scrollHeight - (clientHeight + scrollTop),
                shouldStop=    remaining <= 2;

            // No scrollbar present, do nothing
            if(scrollHeight <= clientHeight) { return; }

            if((d > 0 && scrollTop === 0) || (d<0 && shouldStop)) {
                evt.stopPropagation();
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
