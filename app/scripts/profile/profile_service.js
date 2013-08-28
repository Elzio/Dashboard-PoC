var mod = angular.module('Profile');

mod.factory('profileService', [
    '$http',
    '$parse',
    'promiseTracker',

    function($http, $parse, promiseTracker) {
        var self = this;
        this.demographics = {};
        this.directDeposit = {};
        this.keyDates = {};
        this.ticker = {};

        this.trackers = {
            huge: promiseTracker('huge'),
            demographics: promiseTracker('demographics'),
            directDeposit: promiseTracker('directDeposit'),
            keyDates: promiseTracker('keyDates'),
            ticker: promiseTracker('ticker'),
            sampleArray: promiseTracker('sampleArray')
        };


        angular.forEach(this.trackers, function(tracker) {
           tracker
               .on('start', function(config, id) {
                   //console.log('tracker', id, 'start ->', config);
               })
               .on('done', function(response, id) {
                   //console.log('tracker', id,  'done ->', response);
               });
        });

        function getData(source) {
            var methodName = 'get' + source;
            console.log('getData:', $parse(methodName));

        }

        function getSampleArray() {
            return $http.get('scripts/profile/sample_array.json', {tracker: 'sampleArray'});
        }

        function getHugeFile() {
            return $http.get('scripts/profile/mock_huge.json', {tracker: 'huge'});
        }

        function getDemographics() {
            return $http.get('scripts/profile/mock_demographics.json', {tracker: 'demographics'});
        }

        function getDirectDeposits() {
            return $http.get('scripts/profile/mock_directDeposit.json', {tracker: 'directDeposit'});

        }


        function getKeyDates() {
            return $http.get('scripts/profile/mock_keyDates.json', {tracker: 'keyDates'});
        }

        function getTicker() {
            return $http.get('scripts/profile/mock_ticker.json', {tracker: 'ticker'});

        }

        return function() {
            return {
                getSampleArray: getSampleArray,
                getHugeFile: getHugeFile,
                getDemographics: getDemographics,
                getDirectDeposit: getDirectDeposits,
                getKeyDates: getKeyDates,
                getTicker: getTicker,
                getData: getData,
                trackers: self.trackers
            };
        }

    }
]);


//DEMO ONLY CODE:
//Delay all responses for demo purposes
//Make each new http request take a bit longer,
//this is just so demo looks fancy and we have a new request
//coming back every second to up our loading bar
var delay = 1000;
var app = angular.module('DashboardPoCApp');
function nextDelay() {
    delay += 500;
    return delay;
}
app.factory('delayResponseInterceptor', function($q, $timeout) {
    return function(promise) {
        //Make every new http request be delayed more
        var delay = nextDelay();
        var deferred = $q.defer();
        return promise.then(function(response) {
            $timeout(function() {
                deferred.resolve(response);
            }, delay);
            return deferred.promise;
        }, function(response) {
            $timeout(function() {
                deferred.reject(response);
            }, delay);
            return deferred.promise;
        });
    };
});
app.config(function($httpProvider) {
//    $httpProvider.responseInterceptors.unshift('delayResponseInterceptor');
});
