var colors = ['green', 'orange', 'blue', 'black', 'purple', 'DimGray', 'LightPink', 'Plum', 'silver'];

angular.module('app').factory('mvCalendar2', function ($http, identity, $q, mvPeriodAvailability, mvPeriodScheduleGenerator) {
  return {
    getEvents: function(groupId, periodId) {
      var dfd = $q.defer();
      var groupAvailabilities = mvPeriodScheduleGenerator.get({periodId: periodId});

      groupAvailabilities.$promise.then(function (result) {
        var events = [];
        events.push({
          title: 'Test',
          start: new Date(2015, 8, 1),
          end: new Date(2015, 8, 2),
          color: 'green',
          stick : true
        });

        dfd.resolve(events);
      });

      return dfd.promise;
    }
  }
})