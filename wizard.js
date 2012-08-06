define(['view',
        'anchor/class'],
function(View, clazz) {
  
  function Wizard(el, options) {
    Wizard.super_.call(this, el, options);
    this._steps = [];
    this._i = 0;
    
    var self = this
      , el = this.el;
    
    el.find('.next').on('click', function() {
      if (self._i == self._steps.length - 1) return self.emit('done');
      
      var step = self._steps[++self._i];
      self.emit('next', step.name);
      self._steps[self._i-1].el.addClass('hide');
      self._steps[self._i].el.removeClass('hide');
      self.emit('next');
      return false;
    });
    el.find('.prev').on('click', function() {
      if (self._i == 0) return;
      
      var step = self._steps[--self._i];
      self.emit('prev', step.name);
      self._steps[self._i+1].el.addClass('hide');
      self._steps[self._i].el.removeClass('hide');
      self.emit('next');
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
  
  return Wizard;
});
