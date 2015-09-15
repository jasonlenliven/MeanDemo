angular.module('app').factory('mvMember', function($resource, $q) {
  var memberResource = $resource('/api/members/:id', { id: '@_id', max: '@max', skip: '@skip' }, {
    delete: {
      method: 'DELETE',
      url: 'members/:id',
      params: {id: '@_id'}
    },
    update: {
      method: 'PUT',
      isArray: false,
      params: {id: '@_id'}
    }
  });
  var memberResourceByGroup = $resource('/api/members/group/:groupId', {groupId: '@groupId', max: '@max', skip: '@skip' });

  return {
    resource: memberResource,
    resourceByGroup: memberResourceByGroup
  }
});