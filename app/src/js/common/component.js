define(['vendor/stapes'], function(Stapes) {
  return Stapes.subclass({
    view : function() {
      return void 0;
    },

    controller : function() {
      return this;
    },

    attach : function(selecter) {
      var _self = this;

      m.module($(selecter)[0], {
        controller : function() {
          return _self.controller.apply(_self, arguments);
        },
        view : function() {
          return _self.view.apply(_self, arguments);
        }
      });
    }
  });
});
