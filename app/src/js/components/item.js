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

      var primaryStat;
      var damage;

      if(this.item.isArmor() || this.item.isWeapon()) {
        var primaryStatId = this.get('primaryStatId');

        primaryStat = this.get('stats')[primaryStatId];
        damage = this.get('damage');
      }

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
                  $(el).find('.itemTooltip'));

                resolve();
              }
            });
          }
        }
      }, [
        /**
         * Icon/Tile
         */

        m('div.iconWrapper' + (complete ? '.complete' : ''), [
          m('img.icon', {
            src : this.get('icon'),
            width : 44,
            height : 44
          }),
        ]),

        /**
         * Stack Size
         */

        stackable ?
          m('div.stack', this.get('stackSize') || 1) :
          void 0,

        /**
         * Tooltip
         */

        m('div.itemTooltip.tier' + tierName, [
          m('div.header', [
            m('div.name', this.get('name')),
            m('div.meta', [
              m('div.type', type.name),
              m('div.tier', tierName)
            ])
          ]),
          m('div.details', [
            primaryStat ?
              m('div.heroStat' + (damage ? '.damageType' + damage.type : ''), [
                damage ?
                  m('div.damageType', {
                    style : {
                      backgroundImage : 'url(' + damage.icon + ')'
                    }
                  }) :
                  void 0,
                m('div.primaryStat', [
                  m('div.stat', primaryStat.value),
                  m('div.statName', primaryStat.name)
                ])
              ]) :
              void 0,
            m('div.description', this.get('description'))
          ])
        ]),
      ]);
    }
  });
});
