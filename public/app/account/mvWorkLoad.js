angular.module('app').factory('mvWorkLoad', function() {
  var workLoads = [];

  var mvWorkLoad = function() {
  };

  var contains = function (memberId) {
    if (!workLoads) return false;

    for(var i = 0; i < workLoads.length; i++) {
      if (workLoads[i].memberId == memberId)
        return true;
    }
    return false;
  };

  var getIndexByMemberId = function (memberId) {
    if (workLoads) {
      for (var i = 0; i < workLoads.length; i++) {
        if (workLoads[i].memberId == memberId)
          return i;
      }
    }
    return -1;
  };

  mvWorkLoad.prototype.contains = contains;
  mvWorkLoad.prototype.getIndexByMemberId = getIndexByMemberId;

  mvWorkLoad.prototype.addWeekendWorkLoad = function (memberId) {
    if (!contains(memberId)) {
      var wl = {memberId: memberId, count: 1};
      workLoads.push(wl);
    } else {
      var index = getIndexByMemberId(memberId);
      workLoads[index].count++;
    }
  };

  mvWorkLoad.prototype.getWorkLoads = function () {
    return workLoads;
  };

  return  mvWorkLoad;
});