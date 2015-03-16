require([
  'common/bungie'
], function(Bungie) {
  var _self = this;

  Bungie.authorize('psn').then(function() {
    require([
      'components/vault',
      'components/filter',
      'components/character'
    ], function(Vault, Filter, Character) {
      var filter = new Filter();

      filter.attach('#filter');

      var accounts = Bungie.getAccounts();

      if(accounts.length) {
        accounts[0].getVault().then(function(vault) {
          var vault = new Vault(vault);

          vault.attach('#vault');

          filter.addComponent(vault);
        });

        var characters = accounts[0].getCharacters();
        var allCharacters = document.getElementById('characters');
        //console.log(characters);
          for(var i = 0; i < characters.length; i++) {

          var element = document.createElement('div');
          element.id = 'char' + i;
          var character = new Character(characters[i]);
          character.attach(element);
          allCharacters.appendChild(element);
        }

      }
    });
  }).catch(function(err) {
    console.error(err);
  });
});
