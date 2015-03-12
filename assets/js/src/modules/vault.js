define(['mithril', 'common/bungie'], function(m, Bungie) {
  var vm = {
    init : function(vault) {
      this.title = 'Vault';

      var weaponsBucket = vault.getWeapons();

      this.primaryWeapons = weaponsBucket.getItems(function(item) {
        return item.isPrimaryWeapon();
      });

      this.specialWeapons = weaponsBucket.getItems(function(item) {
        return item.isSpecialWeapon();
      });

      this.heavyWeapons = weaponsBucket.getItems(function(item) {
        return item.isHeavyWeapon();
      });

      var armorBucket = vault.getArmor();

      this.headArmor = armorBucket.getItems(function(item) {
        return item.isHeadArmor();
      });

      this.chestArmor = armorBucket.getItems(function(item) {
        return item.isChestArmor();
      });

      this.armArmor = armorBucket.getItems(function(item) {
        return item.isArmArmor();
      });

      this.legArmor = armorBucket.getItems(function(item) {
        return item.isLegArmor();
      });
    },

    weapons : function() {
      return this.vault.getWeapons();
    },

    armor : function() {
      return this.vault.getArmor();
    },

    general : function() {
      return this.vault.getGeneral();
    }
  };

  m.module(document.querySelector('#vault'), {
    controller : function() {
      var accounts = Bungie.getAccounts();

      if(accounts.length) {
        m.startComputation();

        accounts[0].getVault().then(function(vault) {
          vm.init(vault);

          m.endComputation();
        });
      }
    },

    view : function(ctrl) {
      var createItem = function(item) {
        return m('li', [
          m('img', {
            src : item.icon,
            width : 44,
            height : 44
          })
        ]);
      };

      return [
        m("h1", vm.title),
        m('div#vault-weapons', [
          m('h1', ''),
          m('ul', [
            m('li.clear', [
              m('strong', 'Primary Weapons'),
              m('ul', vm.primaryWeapons.map(createItem))
            ]),
            m('li.clear', [
              m('strong', 'Special Weapons'),
              m('ul', vm.specialWeapons.map(createItem))
            ]),
            m('li.clear', [
              m('strong', 'Heavy Weapons'),
              m('ul', vm.heavyWeapons.map(createItem))
            ])
          ])
        ]),
        m('div#vault-armor', [
          m('h1', ''),
          m('ul', [
            m('li.clear', [
              m('strong', 'Head Armor'),
              m('ul', vm.headArmor.map(createItem))
            ]),
            m('li.clear', [
              m('strong', 'Chest Armor'),
              m('ul', vm.chestArmor.map(createItem))
            ]),
            m('li.clear', [
              m('strong', 'Arm Armor'),
              m('ul', vm.armArmor.map(createItem))
            ]),
            m('li.clear', [
              m('strong', 'Leg Armor'),
              m('ul', vm.legArmor.map(createItem))
            ])
          ])
        ])
      ];
    }
  });
});
