describe('mvScheduleGenerator', function() {
  beforeEach(module('app'));

  describe('isAdmin', function() {
    it('should return false if the roles array does not have an admin entry', inject(function(mvScheduleGenerator) {
      var generator = new mvScheduleGenerator();
      user.roles = ['not admin'];
      expect(user.isAdmin()).to.be.false;
    }));

  })
})