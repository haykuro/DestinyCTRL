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
            banner : character.background,
            emblem : character.emblem,
            class : character.characterClass.name,
            race : character.characterClass.type,
            gender : character.characterClass.gender,
            equipment : [],
            inventory : character.getInventory()
          }, true);

          var equipments = character.getEquipment();

          if(equipments.length) {
            _self.set('equipment', equipments.reduce(function(memo, equipment) {
              return memo.concat(equipment);
            }, []).map(function(item) {
              return new ItemComponent(item, true);
            }));
          }
          m.endComputation();
        }).catch(function(err) {
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
          m('div', {class: 'banner', style: 'background-image: url(' + this.get('banner') + ');'}, [
            //m('div', {class: 'emblem', style: 'background-image: url(' + this.get('emblem') + ');'}),
            m('img', {class: 'emblem', src: this.get('emblem')}),
            m('div', {class: 'details'}, [
              m('div', {class: 'class'}, this.get('class')),
              m('div', {class: 'race'}, this.get('race') + '' + this.get('gender')),
              m('div', {class: 'level'}, this.get('level')),
            ])
          ]),
          m('ul.items', equipmentViews)

        ];
      }

    });
});
