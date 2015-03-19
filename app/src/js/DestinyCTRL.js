require([
  'common/bungie'
], function(Bungie) {
  Bungie.authorize('psn').then(function() {
    require([
      'components/vault',
      'components/filter',
      'components/character'
    ], function(VaultComp, FilterComp, CharacterComp) {
      FilterComp.attach('#filter');

      var accounts = Bungie.getAccounts();

      if(accounts.length) {
        var account = accounts[0];

        account.getVault().then(function(vault) {
          var vaultComp = new VaultComp(vault);

          vaultComp.attach('#vault');
        });

        var charactersNode = document.querySelector('#characters');

        if(charactersNode) {
          account.getCharacters().forEach(function(cModel) {
            var characterComp = new CharacterComp(cModel);
            var charNode = document.createElement('div');

            charNode.id = 'c_' + cModel.id;
            charNode.className = 'character';

            characterComp.attach(charNode);
            charactersNode.appendChild(charNode);
          });
        }

        var toggleVault = document.querySelector('.js-vault');
        var vaultTab = document.querySelector('.sidebar');
        toggleVault.addEventListener('click', function(){
          vaultTab.style.display = vaultTab.style.display === ''||
                                    vaultTab.style.display == 'none' ?
                                    'block' : vaultTab.style.display == 'block' ?
                                    'none' : 'block';
        });

      }
    });
  }).catch(function(err) {
    console.error(err);
  });
});
