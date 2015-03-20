define([
  'common/component',
  'components/item',
  'components/filter'
], function(Component, ItemComp, FilterComp) {
    return Component.subclass({
      constructor : function(character) {
        this.set({
          initialized : false,
          character : character
        }, true);
      },

      sync : function() {
        var self = this;
        var character = this.get('character');

        m.startComputation();

        return character.sync().then(function() {
          self.set({
            initialized : true,
            level : character.level,
            banner : character.background,
            emblem : character.emblem,
            class : character.characterClass.name,
            race : character.characterClass.race,
            gender : character.characterClass.gender,
            equipment : []
          }, true);

          var equipment = character.getEquipment(true);

          if(equipment.length) {
            self.set('equipment', equipment.reduce(function(memo, equipment) {
              return memo.concat(equipment);
            }, []).map(function(item) {
              return new ItemComp(item, true);
            }), true);
          }

          m.endComputation();

          return self;
        });
      },

      view : function() {
        if(! this.get('initialized')) {
          return void 0;
        }

        return m('div.character', [
          m('div.character-header', {
            style : {
              backgroundImage : 'url(' + this.get('banner') + ')'
            }
          }, [
            m('img.character-emblem', {
              src : this.get('emblem'),
              width : 50,
              height : 50
            }),
            m('div', [
              m('div.class', this.get('class')),
              m('div.race', this.get('race') + ' ' + this.get('gender')),
              m('div.level', this.get('level')),
            ])
          ]),
          m('div.character-details', [
            m('ul.items',
              this.get('equipment').map(function(item) {
                return item.view();
              })
            )
          ])
        ]);
      }
    });
});
