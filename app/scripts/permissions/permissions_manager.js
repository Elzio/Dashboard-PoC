var mod = angular.module('permissions_manager');

mod.factory('permissions_manager', [
    '$http',
    function($http) {

        var permissions = $http.get('scripts/permissions/permissions.json');

        return {
            getPermissions: permissions
        }
    }
]);
