define([
  'common/utils',
  'common/component'
], function(Util, Component) {
  function ItemModule() {
    Component.apply(this, arguments);
  }

  Util.inheritClass(ItemModule, Component, {
    controller : function(data) {
      this.model.name = data.name;
      this.model.description = data.description;
      this.model.icon = data.icon;
      this.model.tier = data.tier.name;
    },
    view : function() {
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
        m('div.item-tooltip', [
          m('header', this.model.name),
          m('section', this.model.description)
        ]),
        m('img.item-icon', {
          src : this.model.icon,
          width : 44,
          height : 44
        })
      ]);
    }
  });

  return ItemModule;
});
