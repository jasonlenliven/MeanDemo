angular.module('app').factory('mvMember', function($resource, $q) {
  return $resource('/api/members/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    }
  });

  //return {
  //  resource: UserResource,
  //  save: function(memberAvailability) {
  //    console.log("User Resource: " + memberAvailability.id);
  //    var dfd = $q.defer();
  //    //UserResource.preferWorkDays = memberAvailabilityData.preferWorkDays;
  //    //UserResource.noWorkDays = memberAvailabilityData.noWorkDays;
  //    //UserResource.preferOffDays = memberAvailabilityData.preferOffDays;
  //    memberAvailability.$save().then(function() {
  //      dfd.resolve();
  //    }, function (response) {
  //      dfd.reject(response.data.reason);
  //    });
  //
  //    return dfd.promise;
  //  }
  //}
});