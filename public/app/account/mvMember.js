angular.module('app').factory('mvMember', function($resource, $q) {
  var memberResource = $resource('/api/members/:id', { id: '@_id' }, {
    delete: {
      method: 'DELETE',
      url: 'members/:id',
      params: {id: '@_id'}
    }
  });
  var memberResourceByGroup = $resource('/api/members/group/:groupId', {groupId: '@groupId' });

  return {
    resource: memberResource,
    resourceByGroup: memberResourceByGroup
  }
});