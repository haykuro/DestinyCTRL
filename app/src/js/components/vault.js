define([
  'common/utils',
  'common/bungie',
  'common/component',
  'components/item',
  'components/filter'
], function(_, Bungie, Component, ItemComp, FilterComp) {
  function transformBucket(bucket) {
    return bucket.getItems().map(function(item) {
      return new ItemComp(item);
    });
  }

  function getSiblings(el) {
    var children = function(node) {
      var ret = [];

      for(; node; node = node.nextSibling) {
        if(node.nodeType === 1 && node !== el) {
          ret.push(node);
        }
      }

      return ret;
    };

    return children(el.parentNode.firstChild, el);
  }

  return Component.subclass({
    constructor : function(vault) {
      var bucketArmor = vault.getArmor();
      var bucketWeapons = vault.getWeapons();
      var bucketGeneral = vault.getGeneral();

      this.set({
        armor : transformBucket(bucketArmor),
        weapons : transformBucket(bucketWeapons),
        general : transformBucket(bucketGeneral)
      }, true);

      FilterComp.addComponent(this, {
        get : 'getWeapons',
        set : 'setWeapons'
      });

      FilterComp.addComponent(this, {
        get : 'getArmor',
        set : 'setArmor'
      });

      FilterComp.addComponent(this, {
        get : 'getGeneral',
        set : 'setGeneral'
      });
    },

    view : function() {
      var createItemsTab = function(title, itemKey, active) {
        var items = this.get(itemKey) || [];

        return m('li.tab-header-and-content' + (active ? '.is-active' : ''), [
          m(
            'a.tab-link',
            {
              onclick : function() {
                var parentNode = this.parentNode;

                getSiblings(parentNode).forEach(function(sibling) {
                  sibling.className = sibling.className
                    .split(' ')
                    .filter(function(className) {
                      return className !== 'is-active';
                    })
                    .join(' ');
                });

                parentNode.className = parentNode.className
                  .split(' ')
                  .concat(['is-active'])
                  .join(' ');
              }
            },
            title + ' (' + items.length + ')'
          ),
          m('div.tab-content', items.map(function(item) {
            return item.view();
          }))
        ]);
      }.bind(this);

      return [
        m('section', [
          m('ul.accordion-tabs-minimal', [
            createItemsTab('Weapons', 'weapons', true),
            createItemsTab('Armor', 'armor'),
            createItemsTab('General', 'general')
          ])
        ])
      ];
    },

    getWeapons : function() { return this.get('weapons'); },
    setWeapons : function(weapons) { this.set('weapons', weapons); },

    getArmor : function() { return this.get('armor'); },
    setArmor : function(armor) { this.set('armor', armor); },

    getGeneral : function() { return this.get('general'); },
    setGeneral : function(general) { this.set('general', general); },
  });
});
