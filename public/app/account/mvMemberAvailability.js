angular.module('app').factory('mvMemberAvailability', function($resource, $q) {
  var resource =  $resource('/api/memberAvailability/:year/:month/:memberId',  { }, {
    update: {
      method: 'PUT'
    }
  });

  return {
    resource: resource,
    save: function(memberAvailability) {
      //console.log("User Resource: " + memberAvailability.preferWorkDays);
      var dfd = $q.defer();

      memberAvailability.$save().then(function() {

        dfd.resolve();
      }, function (response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    }
  }
});