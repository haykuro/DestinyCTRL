define(['mithril', 'common/bungie'], function(m, Bungie) {
  var vm = {
    init : function(vault) {
      this.title = 'Vault';

      this.buckets = {
        weapons : vault.getWeapons(),
        armor : vault.getArmor(),
        general : vault.getGeneral()
      };

      this.groups = {
        weapons : {
          title : this.bucket('weapons').name,
          description : this.bucket('weapons').description,
          categories : [
            { name : 'Primary', filter : 'PRIMARY_WEAPON', bucket : 'weapons' },
            { name : 'Special', filter : 'SPECIAL_WEAPON', bucket : 'weapons' },
            { name : 'Heavy', filter : 'HEAVY_WEAPON', bucket : 'weapons' }
          ]
        },
        armor : {
          title : this.bucket('armor').name,
          description : this.bucket('armor').description,
          categories : [
            { name : 'Head', filter : 'HEAD', bucket : 'armor' },
            { name : 'Chest', filter : 'CHEST', bucket : 'armor' },
            { name : 'Arms', filter : 'ARMS', bucket : 'armor' },
            { name : 'Legs', filter : 'LEGS', bucket : 'armor' }
          ]
        },
        other : {
          title : this.bucket('general').name,
          description : this.bucket('general').description,
          categories : [
            { name : 'Shaders', filter : 'SHADER', bucket : 'general' },
            { name : 'Emblems', filter : 'EMBLEMS', bucket : 'general' },
            { name : 'Class', filter : 'CLASS_ITEMS', bucket : 'general' },
            { name : 'Vehicles', filter : 'VEHICLES', bucket : 'general' },
            { name : 'Ships', filter : 'SHIPS', bucket : 'general' },
            { name : 'Materials', filter : 'MATERIALS', bucket : 'general' },
            { name : 'Consumables', filter : 'CONSUMABLES', bucket : 'general' },
          ]
        }
      };
    },

    bucket : function(bucket) {
      return this.buckets[bucket] || {};
    },

    group : function(group) {
      return this.groups[group] || [];
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
      var createGroup = function(cat) {
        var group = vm.group(cat);

        return [
          m('h2', group.title),
          m('p', group.description),
          group.categories.map(function(cat) {
            return m('li.clear', [
              m('h3', cat.name),
              m('ul', vm.bucket(cat.bucket)
                .getItems(cat.filter).map(function(item) {
                  return m('li', [
                    m('img', {
                      src : item.icon,
                      width : 44,
                      height : 44
                    })
                  ]);
                })
              )
            ]);
          })
        ];
      };

      return [
        m("h1", vm.title),
        m('div#vault-weapons', [
          m('ul', createGroup('weapons')),
          m('ul', createGroup('armor')),
          m('ul', createGroup('other'))
        ])
      ];
    }
  });
});
