describe('mvWorkLoad', function() {
  beforeEach(module('app'));

  describe('contains', function() {
    it('should return false if the workload does not contain the member Id', inject(function(mvWorkLoad) {
      var wl = new mvWorkLoad();

      expect(wl.contains(1)).to.be.false;
    }));

    it('should return true if the workload contains the member Id', inject(function(mvWorkLoad) {
      var wl = new mvWorkLoad();
      wl.addWeekendWorkLoad(1);

      expect(wl.contains(1)).to.be.true;
    }));
  });

  describe('addWeekendWorkLoad', function() {
    it('should create new work load if member doe not exist', inject(function(mvWorkLoad) {
      var wl = new mvWorkLoad();

      expect(wl.contains(1)).to.be.false;

      wl.addWeekendWorkLoad(1);

      var count = wl.getWorkLoads()[wl.getIndexByMemberId(1)].count;
      expect(count).to.equal(1);

      wl.addWeekendWorkLoad(1);
      count = wl.getWorkLoads()[wl.getIndexByMemberId(1)].count;
      expect(count).to.equal(2);
    }));

  })
})