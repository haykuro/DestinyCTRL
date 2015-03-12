define(['mithril', 'common/bungie'], function(m, Bungie) {
  var vm = {
    init : function(vault) {
      this.title = 'Vault';
      this.vault = vault;
      this.filter = { type : 'ALL', subType : false };
      this.types = [
        {
          name : 'All [%total%]',
          filter : 'ALL',
          count : 0,
          types : []
        },
        {
          name : 'Weapons [%total%]',
          filter : 'WEAPONS',
          count : 0,
          types : [
            { name : 'All [%total%]', filter : 'ALL', count : 0 },
            { name : 'Primary [%total%]', filter : 'PRIMARY_WEAPON', count : 0 },
            { name : 'Special [%total%]', filter : 'SPECIAL_WEAPON', count : 0 },
            { name : 'Heavy [%total%]', filter : 'HEAVY_WEAPON', count : 0 }
          ]
        },
        {
          name : 'Armor [%total%]',
          filter : 'ARMOR',
          count : 0,
          types : [
            { name : 'All [%total%]', filter : 'ALL', count : 0 },
            { name : 'Head [%total%]', filter : 'HEAD', count : 0 },
            { name : 'Chest [%total%]', filter : 'CHEST', count : 0 },
            { name : 'Arms [%total%]', filter : 'ARMS', count : 0 },
            { name : 'Legs [%total%]', filter : 'LEGS', count : 0 }
          ]
        },
        {
          name : 'General [%total%]',
          filter : 'GENERAL',
          count : 0,
          types : [
            { name : 'All [%total%]', filter : 'ALL', count : 0 },
            { name : 'Materials [%total%]', filter : 'MATERIALS', count : 0 },
            { name : 'Consumables [%total%]', filter : 'CONSUMABLES', count : 0 },
            { name : 'Class [%total%]', filter : 'CLASS_ITEMS', count : 0 },
            { name : 'Shaders [%total%]', filter : 'SHADER', count : 0 },
            { name : 'Emblems [%total%]', filter : 'EMBLEM', count : 0 },
            { name : 'Vehicles [%total%]', filter : 'VEHICLES', count : 0 },
            { name : 'Ships [%total%]', filter : 'SHIPS', count : 0 }
          ]
        }
      ];

      this.sync();
    },

    sync : function() {
      var _self = this;
      var types = vm.getTypes();

      vm.getTypes().forEach(function(type, idx) {
        if(type.filter === 'ALL') {
          allTypeIdx = idx;
        }

        if(type.types.length) {
          type.count = 0;

          type.types.forEach(function(subType) {
            var items = _self.getItems(type.filter, subType.filter);

            subType.count = items.length
            subType.name = subType.name.replace(/%total%/, subType.count);

            if(subType.filter != 'ALL') {
              type.count += subType.count;
            }
          });
        } else {
          type.count = _self.getItems().length;
        }

        type.name = type.name.replace(/%total%/, type.count);
      });
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
        return type.count ?
          m('option', { value : type.filter }, type.name) :
          undefined;
      });

      var subTypes = vm.getSubTypes().map(function(type) {
        return type.count ?
          m('option', { value : type.filter }, type.name) :
          undefined;
      });

      return [
        m("h1", vm.title),
        m('select#vault-type', {
          onchange : function() {
            vm.filter.type = this.value;
            vm.filter.subType = false;
          }
        }, types),
        m('select#vault-subType', {
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
