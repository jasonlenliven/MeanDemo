angular.module('app').controller('memberController', function($scope, mvMember, notifier, $window, $routeParams) {
  var d = new Date();
  var month = d.getMonth();
  var year = d.getFullYear();

  $scope.members = mvMember.resourceByGroup.query({groupId:$routeParams.groupId}); //[{name:'John', id:'abc123' }, {name:'Bob', id:'23242'}];
  $scope.month = month;
  $scope.year = year;

  $scope.groupId = $routeParams.groupId;

  $scope.delete = function(item) {
    if ($window.confirm('Are you sure you want to delete this member?')) {
      mvMember.resource.get({ id:item._id }, function(data) {
        data.$remove({id:item._id}).then(function () {
          notifier.notify('Member deleted!');
          $scope.members.splice($scope.members.indexOf(item), 1);
        }, function (response) {
          notifier.error(response.data.reason);
        });
      });
    }
  }
})