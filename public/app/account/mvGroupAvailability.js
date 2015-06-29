angular.module('app').factory('mvGroupAvailability', function($resource) {
  return  $resource('/api/groupAvailability/:groupId/:year/:month',  {groupId: '@groupId', year:'@year', month: '@month'}, {
    update:{
      method: 'PUT'
    }
  });

});