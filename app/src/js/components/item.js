define([
  'common/component'
], function(Component) {
  return Component.subclass({
    constructor : function(item) {
      var props = {};

      Object.keys(item).forEach(function(key) {
        if(typeof item[key] !== 'function') {
          props[key] = item[key];
        }
      });

      this.set(props, true);
      this.extend({ item : item });
    },

    view : function() {
      var stackable = this.item.isStackable();
      var complete = this.item.isComplete();
      var type = this.get('type');
      var tier = this.get('tier');
      var tierName = tier.name;
      var tierNameLower = tierName.toLowerCase()
        .replace(/[^a-z]/, '-');

      return m('div.item', {
        config : function(el, redraw) {
          if(! redraw) {
            $(el).tooltipster({
              position : 'right',
              maxWidth : 300,
              minWidth : 300,
              autoClose : true,
              functionBefore : function(origin, resolve) {
                origin.tooltipster('content',
                  $(el).find('.item-tooltip'));

                resolve();
              }
            });
          }
        }
      }, [
        m('div.item-tooltip.item-tier-' + tierNameLower, [
          m('header', [
            m('div.item-name', this.get('name')),
            m('div.item-meta', [
              m('div.item-type', type.name),
              m('div.item-tier', tierName)
            ])
          ]),
          m('section', this.get('description'))
        ]),
        m('div.item-icon-wrapper' + (complete ? '.item-complete' : ''), [
          m('img.item-icon', {
            src : this.get('icon'),
            width : 44,
            height : 44
          }),
        ]),
        stackable ?
          m('div.item-stack', this.get('stackSize') || 1) :
          void 0
      ]);
    }
  });
});
