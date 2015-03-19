define([
  'common/component',
  'common/tooltip'
], function(Component, Tooltip) {
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

    weaponStatsView : function() {
      var primaryStatId = this.get('primaryStatId');
      var magazineStatId = 'STAT_MAGAZINE_SIZE';
      var rows = [];
      var stats = this.get('stats');

      if(stats) {
        rows = [];

        Object.keys(stats).filter(function(key) {
          return key !== primaryStatId && key !== magazineStatId;
        }).forEach(function(key) {
          var stat = stats[key];

          rows.push(
            m('tr', [
              m('td.name', stat.name),
              m('td', [
                m('div.value', [
                  m('div.current', {
                    style : {
                      width : stat.percentage + '%'
                    }
                  })
                ])
              ])
            ])
          );
        }, this);

        var magazineStat = stats[magazineStatId];

        if(magazineStat) {
          rows.push(
            m('tr', [
              m('td.name', magazineStat.name),
              m('td', m('strong', magazineStat.value))
            ])
          );
        }
      }

      return rows.length ? m('table.weaponStatsTable', rows) : void 0;
    },

    armorStatsView : function() {
      var stats = this.get('stats');
      var primaryStatId = this.get('primaryStatId');
      var rows = [];

      Object.keys(stats).filter(function(key) {
        var stat = stats[key];

        return key !== primaryStatId && stat.value > 0;
      }).forEach(function(key) {
        var stat = stats[key];

        rows.push(
          m('div.stat', [
            m('img.icon', {
              src : stat.icon,
              width : 20,
              height : 20
            }),
            stat.name + ' ',
            m('strong', '+' + stat.value)
          ])
        );
      });

      return rows.length ? m('div.armorStats', rows) : void 0;
    },

    primaryStatView : function() {
      var primaryStatId = this.get('primaryStatId');

      if(primaryStatId) {
        var primaryStat = this.get('stats')[primaryStatId];
        var damage = this.get('damage');

        return m('div.heroStat' + (damage ? '.damageType' + damage.type : ''), [
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
        ]);
      }
    },

    view : function() {
      var stackable = this.item.isStackable();
      var complete = this.item.isComplete();
      var description = this.get('description');
      var type = this.get('type');
      var tier = this.get('tier');
      var tierName = tier.name;
      var hasStats = this.get('stats') &&
        (this.item.isWeapon() || this.item.isArmor());
      var hasDetails = description || hasStats;

      return m('div.item', {
        config : function(el, redraw) {
          if(! redraw) {
            new Tooltip(el, el.querySelector('.itemTooltip'), 100);
          }
        }
      }, [
        m('div.iconWrapper' + (complete ? '.complete' : ''), [
          m('img.icon', {
            src : this.get('icon'),
            width : 44,
            height : 44
          }),
        ]),
        stackable ?
          m('div.stack', this.get('stackSize') || 1) :
          void 0,
        m('div.itemTooltip.tier' + tierName, [
          m('div.header', [
            m('div.name', this.get('name')),
            m('div.meta', [
              m('div.type', type.name),
              m('div.tier', tierName)
            ])
          ]),
          hasDetails ?
            m('div.details', [
              hasStats ?
                this.primaryStatView() :
                void 0,
              m('div.description', description),
              hasStats ?
                m('div.stats',
                  this.item.isWeapon() ?
                    this.weaponStatsView() :
                    this.armorStatsView()
                ) :
                void 0
            ]) :
            void 0
        ]),
      ]);
    }
  });
});
