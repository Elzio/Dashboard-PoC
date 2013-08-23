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

        function getPermissions(path, action) {
            if(path) {
                console.log('+', self.user_permissions, path, action)
                  var allowed = steeltoe(self.user_permissions).get(path)[action];
                console.log(path,allowed);
                return allowed;
//                return steeltoe(self.user_permissions).get(path)[action];
            }else {
                return self.user_permissions;
            }
        }

        function checkPermission(id, action) {
            console.log(steeltoe({key1:{key2:1}}).get('key1'));

        }
        return {
            getPermissions: getPermissions,
            checkPermission: checkPermission
        }
    }
]);
