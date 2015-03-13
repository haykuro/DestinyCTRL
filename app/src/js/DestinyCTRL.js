require(['common/bungie', 'common/utils'], function(Bungie, Util) {
  var _self = this;

  Bungie.authorize('psn').then(function() {
    require([
      'modules/vault'
    ], function(Vault) {
      //
    });
  }).catch(function(err) {
    console.error(err);
  });
});
