angular.module('app').factory('mvUser', function($resource) {
  var UserResource = $resource('/api/users/:id', {_id: "@id"});

  UserResource.prototype.isAdmin = function() {
    //console.log(this.roles);
    return this.roles && this.roles.indexOf('admin') > -1;
  };

  return UserResource;
});