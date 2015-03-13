define([
  'common/utils',
  'common/component',
  'modules/item',
], function(Util, Component, Item) {
  function Character() {
    Component.apply(this, arguments);
  }

  Util.inheritClass(Character, Component, {
    controller : function() {
      this.model.item = new Item({
        name : 'Derp',
        description : 'More derp',
        icon : '',
        tier : { name : 'Derp' }
      }, true);
    },
    view : function(ctrl) {
      return m('div', {
        style : { width : '100px' }
      }, [
        this.model.item.view()
      ]);
    }
  });

  return Character;
});
