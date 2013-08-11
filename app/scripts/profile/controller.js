'use strict';
var mod = angular.module('Profile');

mod.controller('ProfileCtrl', ['$scope', 'profileService',
    function ($scope, profileService) {
        var profile = new profileService();

        $scope.trackers = profile.trackers;

//        $scope.huge = profile.getHugeFile();
//        profile.getDemographics().then(function(data) {
//            $scope.demographics = data;
//        });
//        $scope.directDeposit = profile.getDirectDeposit();
//        $scope.keyDates = profile.getKeyDates();
//        $scope.ticker = profile.getTicker();
        $scope.dataSource = profile;

    }
]);


mod.controller('tpl1_ctrl', [
    '$scope',
    '$timeout',
    function($scope, $timeout) {
        $scope.data = $scope.demographics;
        $timeout(function() {
            console.log('--', $scope, $scope.demographics);
        }, 2000);

    }
]);