//angular.module('app').value('moment', moment);

angular.module('app').controller('calendarController2', function ($scope, mvCalendar2, mvGroup, $routeParams, mvGroupSchedule) {

  $scope.events = [];
  $scope.eventSources = [$scope.events];
  $scope.loading = true;


  $scope.regenerate = function() {
    if (confirm("Do you want to regenerate the schedule? This will replace the current schedule.")) {

      $("#loading").show();
      $scope.events.splice(0, $scope.events.length);
      var days = getDays($scope.period.startDate, $scope.period.endDate);

      mvCalendar2.regenerate($routeParams.groupId, $scope.period, $scope.group.member_type, days).then(function (data) {

        angular.forEach(data, function (value) {
          $scope.events.push(value);
        });

        $("#loading").hide();
      });

    }
  };


  function getEvents(period, group) {

    $("#loading").show();
    $scope.events.splice(0, $scope.events.length);
    var days = getDays(period.startDate, period.endDate);

    mvCalendar2.getEvents($routeParams.groupId, period, group.member_type, days).then(function(data){

      angular.forEach(data, function(value) {
        $scope.events.push(value);
      });

      $("#loading").hide();
    });
  }


  function getDays(startDate, endDate) {
    var result = new Array();
    var currentDate = new Date(startDate);
    var stopDate = new Date(endDate);
    while (currentDate <= stopDate) {
      currentDate = new Date(currentDate);
      result.push(new Date(currentDate));
      currentDate = currentDate.setDate(currentDate.getDate() + 1);
    }
    return result;
  }



  mvGroup.get({id:$routeParams.groupId}, function(group) {
    $scope.group = group;
    mvGroupSchedule.groupScheduleResource.get({id:$routeParams.periodId}, function(period) {
      $scope.period = period;
      /* config object */
      $scope.uiConfig = {
        calendar: {
          height: 450,
          editable: true,
          defaultDate: period.startDate,
          timeFormat: 'H(:mm)',
          header: {
            left: 'title',
            center: '',
            right: 'today prev,next'
          },
          eventClick: $scope.alertOnEventClick,
          eventDrop: $scope.alertOnDrop,
          eventResize: $scope.alertOnResize,
          eventRender: $scope.eventRender,
          eventDragStop: function (event, jsEvent) {
            var calendar = $('.fc-view-container');
            var ofs = calendar.offset();

            var x1 = ofs.left;
            var x2 = ofs.left + calendar.outerWidth(true);
            var y1 = ofs.top;
            var y2 = ofs.top + calendar.outerHeight(true);

            if ((jsEvent.pageX < x1 || jsEvent.pageX > x2) ||
                (jsEvent.pageY < y1 || jsEvent.pageY > y2)) {
              $('.calendar').fullCalendar('removeEvents', event._id);
            }
          },
          viewRender: function(view, element) {
            getEvents(period, group);
          },
          loading: function(isLoading) {
          }
        }
      };
    });
  });



});