define(['common/bungie'], function(Bungie) {
  function DestinyCTRL() {}

  DestinyCTRL.initialize = function() {
    var _self = this;

    Bungie.authorize().then(function() {
      var accounts = Bungie.getAccounts();

      if(accounts.length) {
        var $vault = $('#vault');

        accounts[0].getVault().then(function(vault) {
          var weaponBucket = vault.getWeapons();
          var weapons = {
            primary : weaponBucket.items.filter(function(item) {
              return item.isPrimaryWeapon();
            }),
            special : weaponBucket.items.filter(function(item) {
              return item.isSpecialWeapon();
            }),
            heavy : weaponBucket.items.filter(function(item) {
              return item.isHeavyWeapon();
            })
          };

          var $weaponsCont = $('<div />');
          var $weaponsTitle = $('<h1 />').text(weaponBucket.name);
          var $weaponsDesc = $('<p />').text(weaponBucket.description);
          var $weaponsList = $('<ul />');
          var $primaryWeapons = $('<li class="clear"><strong>Primary</strong><br /></li>');
          var $specialWeapons = $('<li class="clear"><strong>Special</strong><br /></li>');
          var $heavyWeapons = $('<li class="clear"><strong>Heavy</strong><br /></li>');

          weapons.primary.forEach(function(weapon) {
            var $weapon = $('<li />');
            var $icon = $('<img />')
              .attr('src', weapon.icon);

            $weapon.append($icon);

            $primaryWeapons.append($weapon);
          });

          weapons.special.forEach(function(weapon) {
            var $weapon = $('<li />');
            var $icon = $('<img />')
              .attr('src', weapon.icon);

            $weapon.append($icon);

            $specialWeapons.append($weapon);
          });

          weapons.heavy.forEach(function(weapon) {
            var $weapon = $('<li />');
            var $icon = $('<img />')
              .attr('src', weapon.icon);

            $weapon.append($icon);

            $heavyWeapons.append($weapon);
          });

          $weaponsList.append($primaryWeapons);
          $weaponsList.append($specialWeapons);
          $weaponsList.append($heavyWeapons);

          $weaponsCont.append($weaponsTitle);
          $weaponsCont.append($weaponsDesc);
          $weaponsCont.append($weaponsList);

          $vault.append($weaponsCont);
        });
      }
    }).catch(function(err) {
      alert(err.Message);
    });
  };

  return DestinyCTRL;
});
