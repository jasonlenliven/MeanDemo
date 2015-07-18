describe('mvScheduleGenerator', function() {
  beforeEach(module('app'));

  describe('calculateRanks', function() {
    it('should return true if the date falls into a saturday', inject(function (mvScheduleGenerator) {
      var mTom = {'id':1};
      var mNancy = {'id':2};
      var mDave = {'id':3};
      var nonAvail = new Array(31);
      nonAvail[1] = mTom;
      nonAvail[3] = mTom;
      var ranks = [];
      mvScheduleGenerator.calculateRank(ranks, null, nonAvail);
      expect(ranks[1][0].key).to.equal(1);
      expect(ranks[3][0].key).to.equal(1);
      expect(ranks[1][0].value).to.equal(-100);
    }));
  });
})