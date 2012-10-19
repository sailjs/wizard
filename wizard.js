define(['view',
        'class',
        'sail'],
function(View, clazz, sail) {
  
  function Wizard(el, options) {
    options = options || {};
    Wizard.super_.call(this, el, options);
    this._bodySel = options.bodySelector || '.body';
    this._steps = [];
    this._i = 0;
    this._attached = false;
    
    var self = this
      , el = this.el;
    
    el.find('.prev').addClass('disabled');
    el.find('.prev').on('click', function() {
      if (el.find('.prev').hasClass('disabled')) return false;
      self.prev();
      return false;
    });
    if (options.form === false) {
      // By default, `Wizard` expects to be attached to a form, and will advance
      // to the next step on submit events.  Set `form` option to `false` to
      // override this behavior.
      el.find('.next').on('click', function() {
        if (el.find('.next').hasClass('disabled')) return false;
        self.next(true);
        return false;
      });
    }
  }
  clazz.inherits(Wizard, View);
  
  Wizard.prototype.attach = function(id) {
    if (this._attached) return;
    this._attached = true;
    
    var self = this
      , el = this.el;
    sail.$(id).on('submit', function(e) {
      if (el.find('.next').hasClass('disabled')) return false;
      self.next(true);
      return false;
    })
  }
  
  Wizard.prototype.step = function(name, el, options) {
    if (typeof name != 'string') {
      options = el;
      el = name;
      name = undefined;
    }
    options = options || {};
    
    if (this._steps.length) el.addClass('hide');
    this.el.find(this._bodySel).append(el);
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
