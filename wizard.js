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
      self.next(true);
      return false;
    });
    el.find('.prev').on('click', function() {
      if (el.find('.prev').hasClass('disabled')) return false;
      self.prev();
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
  
  Wizard.prototype.next = function(ask) {
    if (this._i == this._steps.length - 1) { this.emit('done'); return; }
    var step = this._steps[this._i];
    var go = (ask && this.delegate && this.delegate.willNext) ? this.delegate.willNext(step.name, this._i) : true;
    if (go) this._goto(this._i + 1, this._i);
  }
  
  Wizard.prototype.prev = function() {
    if (this._i == 0) return;
    this._goto(this._i - 1, this._i);
  }
  
  Wizard.prototype._goto = function(i, pi) {
    this._i = i;
    var step = this._steps[i];
    this.emit('step', step.name, i);
    this._steps[pi].el.addClass('hide');
    this._steps[i].el.removeClass('hide');
    if (i == 0) this.el.find('.prev').addClass('disabled');
    else this.el.find('.prev').removeClass('disabled');
  }
  
  return Wizard;
});
