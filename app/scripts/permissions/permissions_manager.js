var mod = angular.module('permissions_manager');

mod.factory('permissions_manager', [
    '$http',
    '$q',
    'steeltoe',
    function($http, $q, steeltoe) {
        var self = this;
            self.user_role = 'admin';

        $http.get('scripts/permissions/permissions.json').then(function(response) {
            self.all_permissions = response.data;
            self.user_permissions = self.all_permissions[self.user_role];
        });


        function getPermissions(path, action) {
            if(path && action) {
                return steeltoe(self.user_permissions).get(path)[action];
            }else if(path) {
                return steeltoe(self.user_permissions).get(path);
            }else {
                return self.user_permissions;
            }
        }


        return {
            getPermissions: getPermissions
        };
    }
]);
