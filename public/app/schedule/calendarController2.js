//angular.module('app').value('moment', moment);

angular.module('app').controller('calendarController2', function ($scope, mvCalendar2, mvGroup, $routeParams, mvGroupSchedule) {

  $scope.events = [];
  $scope.eventSources = [$scope.events];

  function getEvents(period) {
    $scope.events.splice(0, $scope.events.length);
    var days = getDays(period.startDate, period.endDate);

    mvCalendar2.getEvents($routeParams.groupId, $routeParams.periodId, days).then(function(data){

      angular.forEach(data, function(value) {
        $scope.events.push(value);
      });

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
    $scope.groupName = group.name;
    mvGroupSchedule.groupScheduleResource.get({id:$routeParams.periodId}, function(period) {
      $scope.period = period;
      /* config object */
      $scope.uiConfig = {
        calendar: {
          height: 450,
          editable: true,
          defaultDate: period.startDate,
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
              //alert('SIII');
              $('.calendar').fullCalendar('removeEvents', event._id);
            }
          },
          viewRender: function(view, element) {
            getEvents(period);
          },
          loading: function(isLoading, view) {
            if (isLoading)
              $('#loading').show();
            else
              $('#loading').hide();
          }
        }
      };
    });
  });



});