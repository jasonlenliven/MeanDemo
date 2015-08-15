describe('mvScheduleGenerator', function() {
  beforeEach(module('app'));

  describe('calculateRanks', function() {

    it('should assign a low/high score based on availability', inject(function (mvScheduleGenerator) {
      var mTom = {'id':1};
      var mNancy = {'id':2};
      var mDave = {'id':3};
      var members = [mTom, mNancy, mDave];


      var nonAvail = [];
      var avail = [];
      var preferOff = [];
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
      var ranks = mvScheduleGenerator.initializeRanks(avail, members);
      ranks = mvScheduleGenerator.calculateRank(ranks, avail, nonAvail, preferOff);
      expect(ranks[1][2].key).to.equal(mTom.id);
      expect(ranks[3][2].key).to.equal(mTom.id);
      expect(ranks[12][2].key).to.equal(mDave.id);
      expect(ranks[1][2].value).to.equal(-100);

      expect(ranks[4][0].key).to.equal(mNancy.id);
      expect(ranks[4][0].value).to.equal(5);

      expect(ranks[4][1].key).to.equal(mDave.id);
      expect(ranks[4][1].value).to.equal(5);

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
  });

  describe('generateSchedule', function() {

    it('should generate schedule base on availabilities', inject(function (mvScheduleGenerator) {
      var tim = {firstName: 'Tim', lastName: 'Duncan', id:'1'};
      var sam = {firstName: 'Sam', lastName: 'Sung', id:'2'};
      var hey = {firstName: 'Hay', lastName: 'Yoo', id:'3'};
      var members = [tim, sam, hey];

      var availabilities = [];
      var nonavailabilities = [];
      var preferOffDays = [];
      var year = 2015;
      var month = 8
      var lastDayInMonth = (new Date(year, month + 1, 0)).getDate();
      var schedules = new Array(lastDayInMonth);
      for(var i = 0; i < lastDayInMonth; i++) {
        availabilities.push({key:i, value:[]});
        nonavailabilities.push({key:i, value:[]});
        preferOffDays.push({key:i, value:[]});
      }

      availabilities[0].value.push(tim);
      availabilities[1].value.push(tim);
      availabilities[1].value.push(sam);
      preferOffDays[1].value.push(tim);

      schedules = mvScheduleGenerator.generateSchedule(
          availabilities, nonavailabilities, preferOffDays, schedules, members, year, month);

      expect(schedules[0]).to.equal(tim);
      expect(schedules[1]).to.equal(sam);
    }));
  });
})