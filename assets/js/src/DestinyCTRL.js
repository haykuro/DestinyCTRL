define(['common/bungie', 'common/utils'], function(Bungie, Util) {
  function DestinyCTRL() {}

  DestinyCTRL.initialize = function() {
    var _self = this;

    Bungie.authorize('psn').then(function() {
      require([
        'modules/vault',
        'modules/character'
      ], function(Vault, Character) {
        var character = new Character();

        character.attach('#character');
      });
    }).catch(function(err) {
      console.error(err);
    });
  };

  return DestinyCTRL;
});
