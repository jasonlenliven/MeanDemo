angular.module('app').factory('mvMemberAvailability', function($resource, $q) {
  var resource =  $resource('/api/memberAvailability/:memberId/:year/:month',  {}, {
    update:{
      method: 'PUT'
    }
  });

  function validateDays(daysPreferToWork, daysCannotWork, daysPreferToBeOff) {

  };

  function checkDays(memberAvailability) {
    var result = memberAvailability.preferWorkDays.filter(function(val) {
      return memberAvailability.noWorkDays.indexOf(val) > -1;
    });

    return result;
  }

  function splitString(value) {
    var result = [];
    if(value && value.length) {

      if (value.constructor === Array) {
        result = value;
      } else {
        result = value.split(/[\s,]+/);
      }
      for(var i = 0; i < result.length; i++) {
        result[i] = parseInt(result[i]);
      }
      result.sort(function(a,b) {
        return a-b;
      });
      return result;
    } else {
      return [];
    }
  }

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
    },
    splitString: splitString,
    checkDays : checkDays
  }
});