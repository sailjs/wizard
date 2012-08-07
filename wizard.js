define(['view',
        'anchor/class'],
function(View, clazz) {
  
  function Wizard(el, options) {
    Wizard.super_.call(this, el, options);
    this._steps = [];
    this._i = 0;
    
    var self = this
      , el = this.el;
    
    el.find('.prev').addClass('disabled');
    el.find('.next').on('click', function() {
      if (el.find('.next').hasClass('disabled')) return false;
      if (self._i == self._steps.length - 1) { self.emit('done'); return false; }
      self._goto(self._i + 1, self._i);
      return false;
    });
    el.find('.prev').on('click', function() {
      if (el.find('.prev').hasClass('disabled')) return false;
      if (self._i == 0) return false;
      self._goto(self._i - 1, self._i);
      return false;
    });
  }
  clazz.inherits(Wizard, View);
  
  Wizard.prototype.step = function(name, el) {
    if (typeof name != 'string') {
      el = name;
      name = undefined;
    }
    
    if (this._steps.length) el.addClass('hide');
    this.el.find('.wizard-body').append(el);
    this._steps.push({ el: el, name: name });
    return this;
  };
  
  Wizard.prototype._goto = function(i, pi) {
    this._i = i;
    var step = this._steps[i];
    this.emit('next', step.name);
    this._steps[pi].el.addClass('hide');
    this._steps[i].el.removeClass('hide');
    if (i == 0) this.el.find('.prev').addClass('disabled');
    else this.el.find('.prev').removeClass('disabled');
  }
  
  return Wizard;
});
