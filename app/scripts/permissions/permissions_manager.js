var mod = angular.module('permissions_manager');

mod.factory('permissions_manager', [
    '$http',
    '$q',
    'steeltoe',
    function($http, $q, steeltoe) {
        var self = this;
            self.user_role = 'admin';

        function loadPermissions() {
            $http.get('scripts/permissions/permissions.json').then(function(response) {
                self.all_permissions = response.data;
                self.user_permissions = self.all_permissions[self.user_role];
                return response.data;
            });
        }

        loadPermissions();

        function getPermissions(path, action) {
            if(path) {
                var isAllowed = steeltoe(self.user_permissions).get(path)[action];
                return isAllowed;
            }else {
                return self.user_permissions;
            }
        }


        return {
            getPermissions: getPermissions
        };
    }
]);
