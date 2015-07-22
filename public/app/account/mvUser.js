angular.module('app').factory('mvUser', function($resource) {
  var UserResource = $resource('/api/users/:id', {_id: "@id"});

  UserResource.prototype.isAdmin = function() {
    //console.log(this.roles);
    return this.roles && this.roles.indexOf('admin') > -1;
  };

  UserResource.prototype.isGroupManager = function() {
    return this.roles &&
        ((this.roles.indexOf('admin') > -1) || (this.roles.indexOf('group_manager') > -1));
  };

  return UserResource;
});