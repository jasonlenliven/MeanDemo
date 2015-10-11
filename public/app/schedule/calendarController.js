//angular.module('app').value('moment', moment);

angular.module('app').controller('calendarController', function ($scope, mvCalendar, mvGroup, $routeParams) {

  $scope.events = [];
  $scope.eventSources = [$scope.events];

  function getEvents() {
    $("#loading").show();
    $scope.events.splice(0, $scope.events.length);
    var date = $('.calendar').fullCalendar('getDate');
    mvCalendar.getEvents($routeParams.groupId, date.get('year'), date.get('month')).then(function(data){

      angular.forEach(data, function(value, key) {
        $scope.events.push(value);
      });
      $("#loading").hide();
    });
  }

  mvGroup.get({id:$routeParams.groupId}, function(group) {
    $scope.groupName = group.name;
  })

  /* config object */
  $scope.uiConfig = {
    calendar: {
      height: 450,
      editable: true,
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
        getEvents();
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