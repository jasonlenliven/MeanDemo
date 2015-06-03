

angular.module('app').controller('calendarController', function ($scope) {
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  $scope.events = [
    {title: 'Dr. Hardy',start: new Date(y, m, 1),end: new Date(y, m, 5)},
    {title: 'Dr.Yoo',start: new Date(y, m, 6),end: new Date(y, m, 8), color: 'green'},
    {title: 'Dr. Stern',start: new Date(y, m, 12),end: new Date(y, m, 17), color: 'black'},
    {title: 'Dr. Nowak',start: new Date(y, m, 25),end: new Date(y, m, 29), color: 'brown'}
  ];

  $scope.eventSources = [$scope.events];

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

});