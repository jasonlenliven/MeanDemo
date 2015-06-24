angular.module('app').factory('mvGroup', function($resource, $q) {
  return $resource('/api/groups/:id', { id: '@_id' }, {
    delete: {
      method: 'DELETE',
      url: 'groups/:id',
      params: {id: '@_id'}
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