

angular.module('app').factory('mvPeriodScheduleGenerator', function ($resource) {
  var resource = $resource('/api/schedules/generate/:periodId', { periodId: '@periodId', memberType: '@memberType' }, {
    'List': {
      method: 'GET',
      isArray: true
    }

  });

  return resource;
});