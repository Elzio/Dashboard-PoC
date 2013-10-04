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

	$scope.status = {editing: false};

	function resolved(item) {
		console.log('resovled', item);
	}

	function rejected(item) {
		console.log('rejected', item);
	}

	function doneEditing() {
		console.log('done edit', arguments);
		$scope.status.editing = false;
		resetDeferred();
	}

	function resetDeferred() {
		self.editDeferred = $q.defer();
		self.editDeferred.promise.then(resolved, rejected);
		self.editDeferred.promise.finally(doneEditing);
	}

	resetDeferred();


	$scope.edit = function(item, idx) {
		$scope.status.editing = idx;
	};

	$scope.cancel = function(item, idx) {
		self.editDeferred.reject(item);
	};

	$scope.save = function(item, idx) {
		self.editDeferred.resolve(item);
	}
};

WidgetBaseController.$injector = ['$scope', '$q'];

mod.controller('tpl1_ctrl', [
	'$injector',
    '$scope',
    '$timeout',
    function($injector, $scope) {
//		$injector.invoke(WidgetBaseController, this, {$scope: $scope});

		$scope.data = {};
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
//        $injector.invoke(WidgetBaseController, this, {$scope: $scope});

		$scope.data = {};
        $scope.tracker = $scope.datasource().trackers.sampleArray;

        $scope.datasource().getSampleArray().then(function(results) {
            $scope.data = results.data;
        });

        $scope.contentTpl = "templates/tpl2_content.html";

    }
]);
