require(['common/bungie', 'common/utils'], function(Bungie, Util) {
  var _self = this;

  Bungie.authorize('psn').then(function() {
    require([
      'modules/vault',
      'modules/character'
    ], function(Vault, Character) {
      new Character().attach('#character');
    });
  }).catch(function(err) {
    console.error(err);
  });
});
