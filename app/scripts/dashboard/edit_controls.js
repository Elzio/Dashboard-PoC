var mod = angular.module('o-dashboard');

mod.directive('editControls', [
	function() {
		return {
			restrict: 'AE',
			templateUrl: 'templates/editControls.html',
			link: function(scope, element, attributes) {

				scope.edit = function(evt, idx) {
					evt.stopPropagation();
					scope.$emit('edit_start', idx);
				};

				scope.cancel = function(evt, idx) {
					evt.stopPropagation();
					scope.$emit('edit_cancel', idx);
				};

				scope.save = function(evt, idx) {
					evt.stopPropagation();
					scope.$emit('edit_save', idx);
				};

				scope.remove = function(evt, idx) {
					scope.$emit('delete_item', idx);
				};
			}
		}
	}
]);