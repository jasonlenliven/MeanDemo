angular.module('app').factory('mvPeriodAvailability', function ($resource, $q) {
  var resource = $resource('/api/periodAvailability/:periodId',
      {periodId: '@periodId', groupId: '@groupId', memberId: '@memberId', days: '@days'}, {
        update: {
          method: 'PUT'
        },
        get: {
          method: 'GET',
          isArray:false
        }

      });

  return resource;
});