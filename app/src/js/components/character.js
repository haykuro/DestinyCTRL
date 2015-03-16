define([
  'common/component'
], function(Component) {
    return Component.subclass({

      constructor : function(character){
        var _self = this;
        character.sync().then(function(){

          _self.set({
            title : character.level,
            score : character._account.grimoire,
            equipment : character.getEquipment(),
            inventory : character.getInventory()
          }, true);


        });
      },

      view : function() {
        var self = this;
      //  var equipment = this.equipment();
      //console.log(self.get('equipment'));

        return [
          m("h1", this.get('title')),
          m("h1", this.get('level')),
          m("p", this.get('score')),

        ];
      }

    });
});
