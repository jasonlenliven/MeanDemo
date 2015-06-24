angular.module('app').controller('memberController', function($scope, mvMember) {
  var d = new Date();
  var month = d.getMonth();
  var year = d.getFullYear();

  $scope.members = mvMember.query(); //[{name:'John', id:'abc123' }, {name:'Bob', id:'23242'}];
  $scope.month = month
  $scope.year = year

})