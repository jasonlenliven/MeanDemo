angular.module('app').factory('identity', function($window, mvUser) {
  var currentUser;
  if(!!$window.bootstrappedUserObject) {
    currentUser = new mvUser();
    angular.extend(currentUser, $window.bootstrappedUserObject);
    //console.log(currentUser.isAmin());
  }
  return {
    currentUser: currentUser,
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    isAuthorized: function(role) {
      return !!this.currentUser && this.currentUser.roles.indexOf('admin') > -1;
    }
  }
})