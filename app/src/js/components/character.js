define([
  'common/component',
  'components/item'
], function(Component, ItemComponent) {
    return Component.subclass({

      constructor : function(character){
        var _self = this;
        _self.set({
          level : 0,
          banner : '',
          emblem : '',
          class : '',
          race : '',
          gender : '',
          equipment : [],
          inventory : []
        }, true);

        character.sync().then(function(){
          _self.set({
            level : character.level,
            banner : character.background,
            emblem : character.emblem,
            class : character.characterClass.name,
            race : character.characterClass.type,
            gender : character.characterClass.gender,
            equipment : [],
            inventory : []
          }, true);

          var equipments = character.getEquipment(true);
          var inventory = character.getInventory();

          if(equipments.length) {
            _self.set('equipment', equipments.reduce(function(memo, equipment) {
              return memo.concat(equipment);
            }, []).map(function(item) {
              return new ItemComponent(item, true);
            }));
          }

          if(inventory.length) {
            _self.set('inventory', inventory.reduce(function(memo, inventory) {
              return memo.concat(inventory);
            }, []).map(function(item) {
              return new ItemComponent(item, true);
            }));
          }

          m.redraw.strategy('diff');
          m.redraw();
        });
      },

      getEquipmentItems : function() {
        return this.get('equipment');
      },

      getInventoryItems : function() {
        return this.get('inventory');
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

        var inventory = this.getInventoryItems();
        var inventoryViews = inventory.map(function(item) {
          return item.view();
        });

        return [
          m('div', {class: 'banner', style: 'background-image: url(' + this.get('banner') + ');'}, [
            m('img', {class: 'emblem', src: this.get('emblem')}),
            m('div', {class: 'details'}, [
              m('div', {class: 'class'}, this.get('class')),
              m('div', {class: 'race'}, this.get('race') + '' + this.get('gender')),
              m('div', {class: 'level'}, this.get('level')),
            ])
          ]),
          m('div', {class: 'equipped'},[
            m('ul.items', equipmentViews)
          ]),
          m('div', {class: 'inventory'},[
            m('ul.items', inventoryViews)
          ])


        ];
      }

    });
});
