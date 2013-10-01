var mod = angular.module('permissions_manager');

mod.factory('permissions_manager', [
    '$http',
    '$q',
    'steeltoe',
    function($http, $q, steeltoe) {
        var self = this,
			data_prom = null,
			deferred = $q.defer();

            self.user_role = 'admin';

        data_prom = $http.get('scripts/permissions/permissions.json');

        function getPermissions(path, action, cb) {

			var cb = path instanceof Function ? path : action instanceof Function ? action : cb;

			data_prom.then(function(response){
				self.all_permissions = response.data;
				self.user_permissions = self.all_permissions[self.user_role];

				if(!(path instanceof Function) && !(action instanceof Function) && path && action) {

					deferred.resolve(steeltoe(self.user_permissions).get(path)[action]);
				}else if(!(path instanceof Function) && path) {

					deferred.resolve(steeltoe(self.user_permissions).get(path));
				}else {

					deferred.resolve(self.user_permissions);
				}
			});

			return deferred.promise;
        }


        return {
            getPermissions: getPermissions
        };
    }
]);