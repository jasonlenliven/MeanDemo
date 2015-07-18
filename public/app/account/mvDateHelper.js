angular.module('app').factory('mvDateHelper', function () {


  return {
    getWeekends: function (year, month) {
      var weekends = [];
      for (var d = new Date(year, month, 1); d < new Date(year, month + 1, 1); d.setDate(d.getDate() + 1)) {
        if (d.getDay() == 0 || d.getDay() == 6) {
          weekends.push(d.getDate());
        }
      }
      return weekends;
    },
    isWeekend: function (d) {
      if (d.getDay() == 0 || d.getDay() == 6) {
        return true;
      }
      return false;
    }
  }
});