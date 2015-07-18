describe('mvDateHelper', function() {
  beforeEach(module('app'));

  describe('isWeekend', function() {
    it('should return true if the date falls into a saturday', inject(function(mvDateHelper) {
      expect(mvDateHelper.isWeekend(new Date(2015, 6, 25))).to.be.true;
    }));

    it('should return true if the date falls into a sunday', inject(function(mvDateHelper) {
      expect(mvDateHelper.isWeekend(new Date(2015, 6, 26))).to.be.true;
    }));

    it('should return false if the date falls into a weekday', inject(function(mvDateHelper) {
      //var dh = new mvDateHelper();
      expect(mvDateHelper.isWeekend(new Date(2015, 6, 17))).to.be.false;
    }));
  })
})