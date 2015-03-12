define(['common/bungie', 'common/utils'], function(Bungie, Util) {
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
          var $weaponsTitle = $('<h1 />').text(weaponBucket.name +
            ' (' + weaponBucket.items.length + '/' + weaponBucket.maxItems + ')');
          var $weaponsDesc = $('<p />').text(weaponBucket.description);
          var $weaponsList = $('<ul />');
          var $primaryWeapons = $('<li class="clear"><strong>Primary</strong><br /></li>');
          var $specialWeapons = $('<li class="clear"><strong>Special</strong><br /></li>');
          var $heavyWeapons = $('<li class="clear"><strong>Heavy</strong><br /></li>');

          weapons.primary.forEach(function(weapon) {
            var $weapon = $('<li />');
            var $icon = $('<img />')
              .width(48)
              .height(48)
              .attr('src', weapon.icon);

            $weapon.append($icon);

            $primaryWeapons.append($weapon);
          });

          weapons.special.forEach(function(weapon) {
            var $weapon = $('<li />');
            var $icon = $('<img />')
              .width(48)
              .height(48)
              .attr('src', weapon.icon);

            $weapon.append($icon);

            $specialWeapons.append($weapon);
          });

          weapons.heavy.forEach(function(weapon) {
            var $weapon = $('<li />');
            var $icon = $('<img />')
              .width(48)
              .height(48)
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
      // Just handling PSN for now because i'm lazy...
      // other authentication options will com later...

      var signInUrl =
        'https://www.bungie.net/en/User/SignIn/Psnid#____destinyCTRL';

      var openAuthWindow = function() {
        var sH = screen.availHeight;
        var sW = screen.availWidth;
        var wH = sH * 0.75 | 0;
        var wW = 300;

        chrome.windows.create({
          url : signInUrl,
          type : 'popup',
          width : wW,
          height : wH,
          top : Math.abs((wH / 2) - (sH / 2)) | 0,
          left : Math.abs((wW / 2) - (sW / 2)) | 0
        }, function(_window) {
          var authCheck = setInterval(function() {
            Bungie.authorize().then(function() {
                clearInterval(authCheck);
                chrome.windows.remove(_window.id);
                window.location.reload();
              }).catch(function(err) {
                if(err.ErrorCode !== 99) {
                  clearInterval(authCheck);
                  alert('Something went wrong, refesh the page.');
                }
              });
          }, 1000);
        });
      };

      chrome.windows.getAll({
        populate : true
      }, function(windows) {
        windows.forEach(function(_window) {
          var isPopup = _window.type === 'popup';
          var isDCTRL = _window.tabs[0].url.indexOf('#____destinyCTRL') > -1;

          if(isPopup && isDCTRL) {
            chrome.windows.remove(_window.id);
          }
        });

        openAuthWindow();
      });
    });
  };

  return DestinyCTRL;
});
