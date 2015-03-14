define([
  'common/utils',
  'common/component',
  'vendor/stapes'
], function(Util, Component, Stapes) {
  var ItemModule = Stapes.subclass({
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
          m('header', this.get('name')),
          m('section', this.get('description'))
        ]),
        m('img.item-icon', {
          src : this.get('icon'),
          width : 44,
          height : 44
        })
      ]);
    }
  });

  return ItemModule;
});
