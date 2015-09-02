angular.module('app').factory('mvGroupSchedule', function($resource) {
  var groupScheduleResource = $resource('/api/groupSchedules/:id', { id: '@_id' }, {
    delete: {
      method: 'DELETE',
      url: 'groupSchedules/:id',
      params: {id: '@_id'}
    },
    update: {
      method: 'PUT',
      isArray: false,
      params: {id: '@_id'}
    }
  });

  var groupSchedulesResourceByGroup = $resource('/api/groups/groupSchedules/:groupId', {groupId: '@groupId' });

  return {
    groupScheduleResource: groupScheduleResource,
    groupSchedulesResourceByGroup: groupSchedulesResourceByGroup
  }

});