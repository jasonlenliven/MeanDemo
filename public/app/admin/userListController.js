angular.module('app').controller('userListController', function ($scope, mvUser) {

  $scope.users = mvUser.query();
});