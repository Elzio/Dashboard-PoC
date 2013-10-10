var mod = angular.module('o-dashboard');

mod.directive('editControls', [
	function() {
		return {
			restrict: 'AE',
			templateUrl: 'templates/editControls.html',
			link: function(scope, element, attributes) {

				scope.edit = function(evt, idx) {
					scope.status.editing = true;
					scope.$emit('edit_start', idx);
				};

				scope.cancel = function(evt, idx) {
					scope.status.editing = false;
					scope.$emit('edit_cancel', idx);
				};

				scope.save = function(evt, idx) {
					scope.status.editing = false;
					scope.$emit('edit_save', idx);
				};

				scope.delete = function(evt, idx) {
					scope.$emit('delete', idx);
				};


			}
		}
	}
]);