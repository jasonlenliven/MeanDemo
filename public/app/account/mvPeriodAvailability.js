angular.module('app').factory('mvPeriodAvailability', function ($resource, $q) {
  var resource = $resource('/api/periodAvailability/:periodId/',
      {periodId: '@periodId'}, {
        update: {
          method: 'PUT'
        },
        get: {
          method: 'GET',
          isArray:true
        }

      });

  var resourceByMember = $resource('/api/periodAvailability/:periodId/:memberId',
      {periodId: '@periodId', memberId: '@memberId', days: '@days'}, {
        update: {
          method: 'PUT'
        },
        get: {
          method: 'GET',
          isArray:false
        }

      });

  return {
    resource: resource,
    resourceByMember: resourceByMember
  }
});