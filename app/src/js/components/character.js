define([
  'common/component',
  'components/item'
], function(Component, ItemComponent) {
    return Component.subclass({

      constructor : function(character){
        var _self = this;
        m.startComputation();
        character.sync().then(function(){

          _self.set({
            level : character.level,
            bg : character.background,
            emblem : character.emblem,
            score : character.account.grimoire,
            equipment : [],
            inventory : character.getInventory()
          }, true);

          var equipments = character.getInventory();

          if(equipments.length) {
            _self.set('equipment', equipments.reduce(function(memo, equipment) {
              return memo.concat(equipment);
            }, []).map(function(item) {
              return new ItemComponent(item, true);
            }));
          }
          m.endComputation();
        });
      },

      getEquipmentItems : function() {
        return this.get('equipment');
      },

      setEquipment : function(equipment) {
        this.set('equipment', equipment);
      },

      view : function() {
        var self = this;
        var equipment = this.getEquipmentItems();
        var equipmentViews = equipment.map(function(item) {
          return item.view();
        });

        return [
        //  m("h1", this.get('title')),
          m("img", {src: this.get('emblem')}),
          m("img", {src: this.get('bg')}),
          m("p", this.get('level')),
          m("p", this.get('score')),
          m('ul.items', equipmentViews)

        ];
      }

    });
});
