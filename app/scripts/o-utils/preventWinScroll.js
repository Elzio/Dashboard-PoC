var mod = angular.module('o-utils');


mod.directive('preventWinScroll', [
    '$window',
    function($window) {

        var scroll_handler = function(evt, d) {
			console.log('evt', evt, d);
            var scrollHeight = evt.currentTarget.scrollHeight,
                clientHeight = evt.currentTarget.clientHeight,
                scrollTop =    evt.currentTarget.scrollTop,
                remaining =    scrollHeight - (clientHeight + scrollTop),
                shouldStop=    remaining <= 2;

            // No scrollbar present, or scrolled horizontally; do nothing

            if(scrollHeight <= clientHeight || evt.originalEvent.wheelDeltaX != 0) { return; }

            if((d > 0 && scrollTop === 0) || (d < 0 && shouldStop)) {
                evt.stopPropagation();
                evt.preventDefault();
            }
        };

        return {
            restrict: 'AC',
            link: function(scope, element, attrs) {
				console.log(element);
                element.bind('mousewheel', scroll_handler);
            }
        };
    }
]);
