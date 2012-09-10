define(['view',
        'class'],
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
  
  Wizard.prototype.step = function(name, el, options) {
    if (typeof name != 'string') {
      options = el;
      el = name;
      name = undefined;
    }
    options = options || {};
    
    if (this._steps.length) el.addClass('hide');
    this.el.find('.wizard-body').append(el);
    this._steps.push({ el: el, name: name, opts: options });
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
  
  Wizard.prototype.to = function(step) {
    var i;
    if (typeof step == 'number') {
      i = step;
    } else if (typeof step == 'string') {
      for (var ix = 0, len = this._steps.length; ix < len; ix++) {
        if (this._steps[ix].name == step) { i = ix; break; }
      }
    }
    if (i == undefined) throw new Error('invalid argument');
    this._goto(i, this._i);
  }
  
  Wizard.prototype._goto = function(i, pi) {
    this._i = i;
    var step = this._steps[i];
    this.emit('step', step.name, i);
    this._steps[pi].el.addClass('hide');
    this._steps[i].el.removeClass('hide');
    if (step.opts.final) {
      this.el.find('.prev').addClass('disabled');
      this.el.find('.next').addClass('disabled');
    } else if (i == 0) {
      this.el.find('.prev').addClass('disabled');
      this.el.find('.next').removeClass('disabled');
    } else if (i == this._steps.length - 1) {
      this.el.find('.prev').removeClass('disabled');
      this.el.find('.next').addClass('disabled');
    } else {
      this.el.find('.prev').removeClass('disabled');
      this.el.find('.next').removeClass('disabled');
    }
    this.emit('stepped', step.name, i);
  }
  
  return Wizard;
});
