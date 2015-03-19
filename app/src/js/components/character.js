define([
  'common/component',
  'components/item',
  'components/filter'
], function(Component, ItemComp, FilterComp) {
    return Component.subclass({
      constructor : function(character){
        this.set({
          initialized : false
        }, true);

        var self = this;

        FilterComp.addComponent(this, {
          get : function() {
            return self.get('inventory') || [];
          },

          set : function(items) {
            self.set('inventory', items);
          }
        });

        character.sync().then(function(){
          self.set({
            initialized : true,
            level : character.level,
            banner : character.background,
            emblem : character.emblem,
            class : character.characterClass.name,
            race : character.characterClass.type,
            gender : character.characterClass.gender,
            equipment : [],
            inventory : []
          });

          var equipments = character.getEquipment(true);
          var inventory = character.getCache(false);

          if(equipments.length) {
            self.set('equipment', equipments.reduce(function(memo, equipment) {
              return memo.concat(equipment);
            }, []).map(function(item) {
              return new ItemComp(item, true);
            }));
          }

          if(inventory.length) {
            self.set('inventory', inventory.reduce(function(memo, inventory) {
              return memo.concat(inventory);
            }, []).map(function(item) {
              return new ItemComp(item, true);
            }));
          }

          FilterComp.updateItemCache();

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
        if(! this.get('initialized')) {
          return void 0;
        }

        var equipment = this.getEquipmentItems();
        var equipmentViews = equipment.map(function(item) {
          return item.view();
        });

        var inventory = this.getInventoryItems();
        var inventoryViews = inventory.map(function(item) {
          return item.view();
        });

        return [
          m('div', {
            className : 'banner',
            style : {
              backgroundImage : 'url(' + this.get('banner') + ')'
            }
          }, [
            m('img', {
              className : 'emblem',
              src : this.get('emblem')
            }),
            m('div', { className : 'details' }, [
              m('div', { className : 'class' }, this.get('class')),
              m('div', { className : 'race' },
                this.get('race') + '' + this.get('gender')),
              m('div', { className : 'level' }, this.get('level')),
            ])
          ]),
          m('div', { className : 'equipped' },[
            m('div', { className : 'section' }, 'Equipped'),
            m('ul.items', equipmentViews)
          ]),
          m('div', { className : 'inventory' }, [
            m('div', { className : 'section' }, 'Inventory'),
            m('ul.items', inventoryViews)
          ])
        ];
      }

    });
});
