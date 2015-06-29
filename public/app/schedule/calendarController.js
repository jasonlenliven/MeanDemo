

angular.module('app').controller('calendarController', function ($scope, mvCalendar, $routeParams) {

  $scope.events = [];
  $scope.eventSources = [$scope.events];

  mvCalendar.getEvents($routeParams.groupId, $routeParams.year, $routeParams.month).then(function(data){
    $scope.events.splice(0, $scope.events.length);

    angular.forEach(data, function(value, key) {
      $scope.events.push(value);
    });

    //$scope.events = data;
    //$scope.eventSources = [$scope.events];

    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    //$('.calendar').fullCalendar('refetchEvents');
  });



});