var mod = angular.module('permissions_manager');

mod.factory('permissions_manager', [
    '$http',
    'steeltoe',
    function($http, steeltoe) {
        var self = this;
            self.user_role = 'admin';

        function loadPermissions() {
            $http.get('scripts/permissions/permissions.json').then(function(response) {
                self.all_permissions = response.data;
                self.user_permissions = self.all_permissions[self.user_role];
                return response.data;
            });
        }

        function getPermissions(path) {
            if(path) {
                return steeltoe(self.user_permissions).get(path);
            }else {
                return self.user_permissions;
            }
        }

        function permissionCheck(id, action) {
            return steeltoe(self.user_permissions).get(id)[action];
        }

        return {
            getPermissions: getPermissions
        }
    }
]);
