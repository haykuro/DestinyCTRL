define([
  'common/bungie',
  'common/component',
  'components/item',
  'common/utils'
], function(Bungie, Component, ItemComponent, _) {
  return Component.subclass({
    constructor : function(vault) {
      this.set({
        title : 'Vault',
        items : []
      }, true);

      var buckets = vault.getAll();

      if(buckets.length) {
        this.set('items', buckets.reduce(function(memo, bucket) {
          return memo.concat(bucket.getItems());
        }, []).map(function(item) {
          return new ItemComponent(item, true);
        }));
      }
    },

    view : function() {
      var self = this;
      var items = this.getItems();
      var itemViews = items.map(function(item) {
        return item.view();
      });

      return [
        m("h1", this.get('title')),
        m('ul.items', itemViews)
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
