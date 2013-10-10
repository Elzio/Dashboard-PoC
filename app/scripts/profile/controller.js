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

	$scope.status = {};

	function resolved() {
		console.log('edit resolved', arguments);
	}

	function rejected() {
		console.log('edit canceled', arguments);
	}

	function doneEditing() {
		delete $scope.status.editing;
		delete $scope.status.idx;
	}

	function edit(evt, idx) {
		evt.stopPropagation();

		// Failsafe: This shouldn't happen as edit buttons are hidden while in edit mode
		if(self.editDeferred != null) self.editDeferred.reject('starting to edit something else, rolling back');

		resetDeferred();

		if ((evt.currentScope != evt.targetScope) && idx != null) {
			$scope.status = {editing: true, idx: idx};

		}else {
			$scope.status = {editing: true};
		}

		console.log($scope.widget.currentTemplate);
		console.log($scope.contentTpl);

	}

	function cancel(evt, item, idx) {
		evt.stopPropagation();
		if(self.editDeferred != null) self.editDeferred.reject(arguments);
	}

	function save(evt, item, idx) {
		evt.stopPropagation();
		if(self.editDeferred != null) self.editDeferred.resolve(arguments);
	}

	$scope.$on('edit_start', edit);
	$scope.$on('edit_cancel', cancel);
	$scope.$on('edit_save', save);

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

		$scope.data = {};
        $scope.tracker = $scope.datasource().trackers.sampleArray;

        $scope.datasource().getSampleArray().then(function(results) {
            $scope.data = results.data;
        });

		$scope.contentTpl = 'bobo';
    }
]);
