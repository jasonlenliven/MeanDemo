angular.module('app').controller('editMemberController', function($scope, mvMember, notifier, $location, $routeParams) {
  var member = mvMember.resource.get({id:$routeParams.id}, function() {
    $scope.firstName = member.firstName;
    $scope.lastName = member.lastName;
    $scope.prefix = member.prefix;
    $scope.email = member.email;
    $scope.phone = member.phone;

    $scope.group_id = member.group_id;
  });

  $scope.update = function() {
    var newMemberData = {
      firstName : $scope.firstName,
      lastName : $scope.lastName,
      prefix : $scope.prefix,
      email : $scope.email,
      phone : $scope.phone,
      group_id : $scope.group_id
    };

    var newMember = new mvMember.resource(newMemberData);

    newMember.$update({id:$routeParams.id}).then(function() {
      notifier.notify('Successfully updated member!');
      $location.path('/schedule/member/group/' + $scope.group_id);
    }, function (response) {
      notifier.error(response.data.reason);
    });
  };



})