define(['mithril'], function(m) {
  function Component() {
    var args = [].slice.call(arguments);
    var init = false;

    if(args.length) {
      var last = args[args.length - 1];

      if(typeof last === 'boolean') {
        init = last;
        args.splice(args.length - 1, 1);
      }
    }

    this.model = {};

    if(init) {
      this.controller.apply(this, args);
    } else {
      this._controllerArgs = args;
    }
  }

  Component.prototype.view = function() {
    throw new Error('View is not implemented');
  };

  Component.prototype.controller = function() {
    throw new Error('Controller is not implemented');
  };

  Component.prototype.attach = function(selecter) {
    var _self = this;

    m.module($(selecter)[0], {
      controller : function() {
        return _self.controller.apply(_self, _self._controllerArgs);
      },
      view : function() {
        return _self.view.apply(_self, arguments);
      }
    });

    delete this._controllerArgs;
  }

  return Component;
});
