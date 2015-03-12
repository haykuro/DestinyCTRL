define(['mithril', 'common/bungie'], function(m, Bungie) {
  var vm = {
    init : function(vault) {
      this.title = 'Vault';
      this.vault = vault;
      this.filter = { type : 'ALL', subType : false };
      this.types = [
        {
          name : 'All',
          filter : 'ALL',
          types : []
        },
        {
          name : 'Weapons',
          filter : 'WEAPONS',
          types : [
            { name : 'All', filter : 'ALL' },
            { name : 'Primary', filter : 'PRIMARY_WEAPON' },
            { name : 'Special', filter : 'SPECIAL_WEAPON' },
            { name : 'Heavy', filter : 'HEAVY_WEAPON' }
          ]
        },
        {
          name : 'Armor',
          filter : 'ARMOR',
          types : [
            { name : 'All', filter : 'ALL' },
            { name : 'Head', filter : 'HEAD' },
            { name : 'Chest', filter : 'CHEST' },
            { name : 'Arms', filter : 'ARMS' },
            { name : 'Legs', filter : 'LEGS' }
          ]
        },
        {
          name : 'General',
          filter : 'GENERAL',
          types : [
            { name : 'All', filter : 'ALL' },
            { name : 'Materials', filter : 'MATERIALS' },
            { name : 'Consumables', filter : 'CONSUMABLES' },
            { name : 'Class', filter : 'CLASS_ITEMS' },
            { name : 'Shaders', filter : 'SHADER' },
            { name : 'Emblems', filter : 'EMBLEM' },
            { name : 'Vehicles', filter : 'VEHICLES' },
            { name : 'Ships', filter : 'SHIPS' }
          ]
        }
      ];
    },

    getItems : function(type, subType) {
      var buckets;

      switch(type) {
        case 'WEAPONS':
          buckets = [vm.vault.getWeapons()];
          break;
        case 'ARMOR':
          buckets = [vm.vault.getArmor()];
          break;
        case 'GENERAL':
          buckets = [vm.vault.getGeneral()];
          break;
        default:
          buckets = vm.vault.getAll();
          break;
      }

      return buckets.reduce(function(memo, bucket) {
        var items = memo.concat(bucket.getItems());

        if(subType && subType != 'ALL') {
          items = items.filter(function(item) {
            return item.type.bucket === subType;
          });
        }

        return items;
      }, []);
    },

    getTypes : function() {
      return this.types;
    },

    getSubTypes : function() {
      var _self = this;
      var subTypes = [];

      this.types.some(function(type) {
        if(_self.filter.type === type.filter) {
          subTypes = type.types;
          return true;
        }
      });

      return subTypes;
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

    view : function() {
      var types = vm.getTypes().map(function(type) {
        return m('option', { value : type.filter }, type.name);
      });

      var subTypes = vm.getSubTypes().map(function(type) {
        return m('option', {
          value : type.filter,
          onchange : function() {
            vm.filter.subType = this.value;
          }
        }, type.name);
      });

      return [
        m("h1", vm.title),
        m('select#vault-type', {
          onchange : function() {
            vm.filter.type = this.value;
            vm.filter.subType = false;
          }
        }, types),
        m('select#vault-subtype', {
          selectedindex : 0,
          disabled : ! subTypes.length,
          onchange : function() {
            vm.filter.subType = this.value;
          }
        }, subTypes),
        m('ul', vm.getItems(
          vm.filter.type,
          vm.filter.subType
        ).map(function(item) {
          return m('li', m('img', {
            src : item.icon,
            width : 44,
            height : 44
          }));
        }))
      ];
    }
  });
});
