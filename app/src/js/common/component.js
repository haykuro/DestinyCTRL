define([
  'vendor/stapes'
], function(Stapes) {
  return Stapes.subclass({
    view : function() {
      return void 0;
    },

    controller : function() {
      return this;
    },

    attach : function(selecter) {
      var self = this;

      m.module(document.querySelector(selecter), {
        controller : function() {
          return self.controller.apply(self, arguments);
        },
        view : function() {
          return self.view.apply(self, arguments);
        }
      });
    }
  });
});
