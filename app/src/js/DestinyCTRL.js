require(['common/bungie', 'common/utils'], function(Bungie, Util) {
  var _self = this;

  Bungie.authorize('psn').then(function() {
    require([
      'modules/vault'
    ], function(Vault) {
      var accounts = Bungie.getAccounts();

      if(accounts.length) {
        accounts[0].getVault().then(function(vault) {
          var vault = new Vault(vault);

          vault.attach('#vault');
        });
      }
    });
  }).catch(function(err) {
    console.error(err);
  });
});
