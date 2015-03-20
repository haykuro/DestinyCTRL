define([
  'common/component',
  'components/character'
], function(Component, CharacterComp) {
  return Component.subclass({
    constructor : function(characters) {
      this.set({
        characters : characters.map(function(character) {
          return new CharacterComp(character);
        }) || []
      }, true);

      this.get('characters').forEach(function(character) {
        character.sync();
      });
    },

    view : function() {
      return this.get('characters').map(function(character) {
        return character.view();
      });
    }
  });
});
