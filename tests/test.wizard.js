define(['wizard/wizard',
        'chai'],
function(Wizard, chai) {
  var expect = chai.expect;

  describe("wizard", function() {
    
    it('should export constructor', function() {
      expect(Wizard).to.exist;
      expect(Wizard).to.be.a('function');
    });
    
  });
  
  return { name: "test.wizard" }
});
