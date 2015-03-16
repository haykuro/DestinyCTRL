require([
  'common/bungie'
], function(Bungie) {
  var _self = this;

  Bungie.authorize('psn').then(function() {
    require([
      'components/vault',
      'components/filter'
    ], function(Vault, Filter) {
      var filter = new Filter();

      filter.attach('#filter');

      var accounts = Bungie.getAccounts();

      if(accounts.length) {
        accounts[0].getVault().then(function(vault) {
          var vault = new Vault(vault);

          vault.attach('#vault');

          filter.addComponent(vault);
        });
      }
    });
  }).catch(function(err) {
    console.error(err);
  });
});
