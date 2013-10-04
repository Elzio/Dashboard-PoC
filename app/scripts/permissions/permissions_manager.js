var mod = angular.module('permissions_manager');

mod.factory('permissions_manager', [
    '$http',
    '$q',
    'steeltoe',
    function($http, $q, steeltoe) {
        var self = this,
			data_prom = null;

            self.user_role = 'admin';

        data_prom = $http.get('scripts/permissions/permissions.json');

        function getPermissions(path, action) {
			var deferred = $q.defer();

			data_prom.then(function(response){


				self.all_permissions = response.data;
				self.user_permissions = self.all_permissions[self.user_role];

				if(path && action) {
					var perms = steeltoe(self.user_permissions).get(path)[action];
				}else if(path) {
					perms = steeltoe(self.user_permissions).get(path);
				}else {
					perms = self.user_permissions;
				}

				deferred.resolve(perms);
			});

			return deferred.promise;
        }


        return {
            getPermissions: getPermissions
        };
    }
]);