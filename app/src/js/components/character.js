define([
  'common/component'
], function(Component) {
    return Component.subclass({

      constructor : function(character){
        this.set({
          title : 'Character',
          equipment : [],
          inventory : []
        }, true);

        var bucket = character.getEquipment();
        console.log(bucket);

      },

      view : function() {
        var self = this;
      //  var equipment = this.equipment();
      
        return [
          m("h1", this.get('title')),

        ];
      }

    });
});
