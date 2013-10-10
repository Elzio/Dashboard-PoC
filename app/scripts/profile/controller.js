'use strict';
var mod = angular.module('Profile');

mod.controller('ProfileCtrl', ['$scope', 'profileService',
    function ($scope, profileService) {
        $scope.profileService = new profileService();

    }
]);


var WidgetBaseController = function($scope, $q) {

	var self = this;
	    self.editDeferred = null;

	function resetDeferred() {
		self.editDeferred = $q.defer();
		self.editDeferred.promise.then(resolved, rejected);
		self.editDeferred.promise.finally(doneEditing);
	}


	$scope.editStatus = {};

	function resolved(args) {
		console.log('edit resolved', args);

		self.commitChanges.apply(self, args);

	}

	function rejected(evt, idx) {
		console.log('edit canceled', args);
	}

	function doneEditing() {
		delete $scope.editStatus.editing;
		delete $scope.editStatus.idx;

	}

	function edit(evt, idx) {
		evt.stopPropagation();


		// Failsafe: This shouldn't happen as edit buttons are hidden while in edit mode
		if(self.editDeferred != null) self.editDeferred.reject('starting to edit something else, rolling back');

		resetDeferred();

		if ((evt.currentScope != evt.targetScope) && idx != null) {
			$scope.editStatus = {editing: true, idx: idx};

		}else {
			$scope.editStatus = {editing: true};
		}
	}

	function cancel(evt, idx) {
		evt.stopPropagation();
		if(self.editDeferred != null) self.editDeferred.reject(arguments);
	}

	function save(evt, idx) {
		evt.stopPropagation();
		if(self.editDeferred != null) self.editDeferred.resolve(arguments);
	}

	function remove(evt, idx) {
		evt.stopPropagation();
		if ((evt.currentScope != evt.targetScope) && idx != null) {
			console.log('removing', $scope.data.items[idx]);
		}
	}

	$scope.$on('edit_start', edit);
	$scope.$on('edit_cancel', cancel);
	$scope.$on('edit_save', save);
	$scope.$on('delete_item', remove);

};

WidgetBaseController.$injector = ['$scope', '$q', 'editService'];


mod.controller('tpl1_ctrl', [
	'$injector',
    '$scope',
    '$timeout',
    function($injector, $scope) {
		$injector.invoke(WidgetBaseController, this, {$scope: $scope});

		$scope.data = {};

		$scope.tracker = $scope.datasource().trackers.demographics;
        $scope.datasource().getDemographics().then(function(results) {
            $scope.data = results.data;
        });


    }
]);

mod.controller('tpl2_ctrl', [
	'$injector',
    '$scope',
    '$timeout',
    function($injector, $scope) {
        $injector.invoke(WidgetBaseController, this, {$scope: $scope});


		this.commitChanges = function(evt, idx) {
			console.log('committing changes', evt, idx);
		}


		$scope.data = {};
        $scope.tracker = $scope.datasource().trackers.sampleArray;

        $scope.datasource().getSampleArray().then(function(results) {
            $scope.data = results.data;
        });
    }
]);
