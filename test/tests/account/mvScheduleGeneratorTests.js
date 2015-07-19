describe('mvScheduleGenerator', function() {
  beforeEach(module('app'));

  describe('calculateRanks', function() {

    it('should assign a low/high score based on availability', inject(function (mvScheduleGenerator) {
      var mTom = {'id':1};
      var mNancy = {'id':2};
      var mDave = {'id':3};
      var nonAvail = [];
      var avail = [];
      for(var i=0; i < 31; i++) {
        nonAvail.push({key:i, value:[]});
        avail.push({key:i, value:[]});
      }
      nonAvail[1].value.push(mTom);
      nonAvail[3].value.push(mTom);
      nonAvail[12].value.push(mDave);

      avail[4].value.push(mNancy);
      avail[4].value.push(mDave);
      avail[5].value.push(mNancy);
      avail[6].value.push(mDave);
      var ranks = [];
      ranks = mvScheduleGenerator.calculateRank(ranks, avail, nonAvail);
      expect(ranks[1][0].key).to.equal(mTom.id);
      expect(ranks[3][0].key).to.equal(mTom.id);
      expect(ranks[12][0].key).to.equal(mDave.id);
      expect(ranks[1][0].value).to.equal(-100);

      expect(ranks[4][0].key).to.equal(mNancy.id);
      expect(ranks[4][0].value).to.equal(3);

      expect(ranks[4][1].key).to.equal(mDave.id);
      expect(ranks[4][1].value).to.equal(3);

      expect(ranks[5][0].key).to.equal(mNancy.id);
      expect(ranks[6][0].key).to.equal(mDave.id);
    }));
  });

  describe('sortRanks', function() {

    it('should sort based on ranks', inject(function (mvScheduleGenerator) {
      ranks = [];
      ranks.push({key:1, value: 3});
      ranks.push({key:1, value: 4});
      ranks.push({key:1, value: 7});
      ranks.push({key:1, value: 10});
      ranks = mvScheduleGenerator.sortRanks(ranks);
      expect(ranks[0].value).to.equal(10);
      expect(ranks[1].value).to.equal(7);
      expect(ranks[2].value).to.equal(4);
      expect(ranks[3].value).to.equal(3);
    }));
  })
})