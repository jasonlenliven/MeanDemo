angular.module('app').controller('newMemberController', function($scope, mvMember, notifier, $location, $routeParams) {

  $scope.groupId = $routeParams.groupId;

  $scope.save = function(addMore) {
    var newMemberData = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      prefix: $scope.prefix,
      email: $scope.email,
      phone: $scope.phone,
      group_id: $routeParams.groupId
    };

    var newMember = new mvMember.resource(newMemberData);

    newMember.$save().then(function() {
      notifier.notify('New member created!');
      if (addMore) {
        //$scope.newMemberForm.$setPristine();
        $scope.firstName = undefined;
        $scope.lastName = undefined;
        $scope.prefix = undefined;
        $scope.email = undefined;
        $scope.phone = undefined;

        //$location.path("/schedule/member_new");
      } else {
        $routeParams.groupId = "";
        $location.path("/schedule/member/group/" + $scope.groupId);
      }
    }, function (response) {
      notifier.error(response.data.reason);
    });
  }

})