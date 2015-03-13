define([
  'common/utils',
  'common/component'
], function(Util, Component) {
  function Character() {
    Component.apply(this, arguments);
  }

  Util.inheritClass(Character, Component, {
    controller : function() {
      //
    },
    view : function() {
      //
    }
  });

  return Character;
});
