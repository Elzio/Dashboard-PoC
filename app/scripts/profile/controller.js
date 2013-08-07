'use strict';
var mod = angular.module('Profile');

mod.controller('ProfileCtrl', ['$scope', 'profileService',
    function ($scope, profileService) {
        var profile = new profileService();

        $scope.trackers = profile.trackers;

        $scope.huge = profile.getHugeFile();
        $scope.demographics = profile.getDemographics();
        $scope.directDeposit = profile.getDirectDeposit();
        $scope.keyDates = profile.getKeyDates();
        $scope.ticker = profile.getTicker();

    }
]);
