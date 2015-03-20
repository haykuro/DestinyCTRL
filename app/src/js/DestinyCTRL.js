require([
  'common/bungie'
], function(Bungie) {
  Bungie.authorize('psn').then(function() {
    require([
      'components/vault',
      'components/filter',
      'components/characters'
    ], function(VaultComp, FilterComp, CharactersComp) {
      FilterComp.attach('#filter');

      var accounts = Bungie.getAccounts();

      if(accounts.length) {
        var account = accounts[0];

        account.getVault().then(function(vault) {
          var vaultComp = new VaultComp(vault);

          vaultComp.attach('#vault');
        });

        var characters = account.getCharacters();
        var charactersComp = new CharactersComp(characters);

        charactersComp.attach('#characters');

        var vaultBtns = document.querySelectorAll('.js-vault');
        var sidebar = document.querySelector('.sidebar');

        [].forEach.call(vaultBtns, function(btn) {
          btn.addEventListener('click', function() {
            var hidden = getComputedStyle(sidebar).display === 'none';

            sidebar.style.display = hidden ? 'block' : 'none';
          });
        });
      }
    });
  }).catch(function(err) {
    console.error(err);
  });
});
