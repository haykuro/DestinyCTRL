define([
  'common/bungie',
  'common/component',
  'components/item',
  'components/filter',
  'common/utils'
], function(Bungie, Component, ItemComp, FilterComp, _) {
  return Component.subclass({
    constructor : function(vault) {
      this.set({
        items : []
      }, true);

      var buckets = vault.getAll();

      if(buckets.length) {
        this.set('items', buckets.reduce(function(memo, bucket) {
          return memo.concat(bucket.getItems());
        }, []).map(function(item) {
          return new ItemComp(item, true);
        }));
      }

      FilterComp.addComponent(this);
    },

    view : function() {
      var self = this;
      var items = this.getItems();
      var itemViews = items.map(function(item) {
        return item.view();
      });

      return [
        //m('div', {class: 'section'}, 'Vault'),
        m('div', {class: 'vault'}, [
          m('ul.items', itemViews)
        ])
      ];
    },

    getItems : function() {
      return this.get('items');
    },

    setItems : function(items) {
      this.set('items', items);
    }
  });
});
