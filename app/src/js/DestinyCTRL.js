require([
  'common/bungie'
], function(Bungie) {
  var _self = this;

  Bungie.authorize('psn').then(function() {
    require([
      'components/vault',
      'components/filter',
      'components/character'
    ], function(VaultComp, FilterComp, CharacterComp) {
      var filterComp = new FilterComp();
      var accounts = Bungie.getAccounts();

      filterComp.attach('#filter');

      if(accounts.length) {
        var account = accounts[0];

        account.getVault().then(function(vault) {
          var vaultComp = new VaultComp(vault);

          vaultComp.attach('#vault');

          filterComp.addComponent(vault);
        });

        var charactersNode = document.querySelector('#characters');

        if(charactersNode) {
          account.getCharacters().forEach(function(cModel) {
            var character = new CharacterComp(cModel);
            var charNode = document.createElement('div');

            charNode.id = cModel.id;
            charNode.className = 'character';

            character.attach(charNode);

            charactersNode.appendChild(charNode);
          });
        }
      }
    });
  }).catch(function(err) {
    console.error(err);
  });
});
