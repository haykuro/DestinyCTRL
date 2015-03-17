define([
  'common/component',
  'common/utils'
], function(Component, _) {
  function regexEscape(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  var validFilters = [
    'weapon', 'armor', 'general',
    'head', 'chest', 'arm', 'leg',
    'primary', 'special', 'heavy',
    'common', 'uncommon', 'rare', 'legendary', 'exotic',
    'arc', 'solar', 'void', 'kinetic',
    'shader', 'emblem', 'class', 'vehicle', 'ship',
    'material', 'consumable'
  ];

  return Component.subclass({
    constructor : function() {
      this.set({
        components : [],
        itemCache : {}
      });

      this.on('change:search', function(query) {
        this.filterComponents(query);
      });
    },

    view : function() {
      var self = this;

      return m('input#vault-filter[type=text].form-control', {
        placeholder : 'e.g. is:primary is:kinetic',
        config : function(el, redraw) {
          if(! redraw) {
            el.addEventListener('keyup', _.throttle(function() {
              self.set('search', this.value);

              m.redraw.strategy('diff');
              m.redraw();
            }, 250));
          }
        }
      });
    },

    parseFilters : function(query) {
      if(query.length === 0) {
        return [];
      }

      var search = query.split(' ').filter(function(part) {
        return part.length;
      });

      return search.map(function(expression) {
        expression = expression.toLowerCase();

        var builtExpr = {};

        if(expression.indexOf('is:') > -1) {
          builtExpr.type = 'is';
          builtExpr.term = expression.replace(/^is:/, '');
        } else if(expression.length > 0) {
          var parts = expression.split('').map(regexEscape);

          builtExpr.type = 'fuzzy';
          builtExpr.term = new RegExp(
            parts.length ?
              parts.reduce(function(a, b) {
                return a + '[^' + b + ']*' + b;
              }) :
              regexEscape(expression) + '*?',
            ['i']
          );
        }

        return builtExpr;
      }).filter(function(builtExpr) {
        var valid = true;

        if(builtExpr.type === 'is') {
          valid = validFilters.indexOf(builtExpr.term) > -1
        }

        return valid;
      });
    },

    addComponent : function(component) {
      if(component instanceof Component) {
        var components = this.get('components') || [];
        var itemCache = this.get('itemCache') || {};
        var filterId = components.push(component);

        component.set('__filter', filterId);

        itemCache[filterId] = component.getItems();

        this.set('components', components);
        this.set('itemCache', itemCache);
      }
    },

    filterComponents : function(query) {
      var filters = this.parseFilters(query);
      var components = this.get('components') || [];
      var itemCache = this.get('itemCache') || {};

      components.forEach(function(component) {
        var filterId = component.get('__filter') || -1;
        var items = filterId > -1 && itemCache.hasOwnProperty(filterId) ?
          itemCache[filterId] :
          [];

        if(items.length) {
          var filtered = [];

          items.forEach(function(item) {
            var aggregate = [];

            filters.forEach(function(filter) {
              if(filter.type === 'is') {
                if(filter.term === 'weapon') {
                  aggregate.push(item.item.isWeapon());
                } else if(filter.term === 'armor') {
                  aggregate.push(item.item.isArmor());
                } else if(filter.term === 'general') {
                  aggregate.push(item.item.isGeneral());
                } else if(filter.term === 'head') {
                  aggregate.push(item.item.isHeadArmor());
                } else if(filter.term === 'chest') {
                  aggregate.push(item.item.isChestArmor());
                } else if(filter.term === 'arm') {
                  aggregate.push(item.item.isArmArmor());
                } else if(filter.term === 'leg') {
                  aggregate.push(item.item.isLegArmor());
                } else if(filter.term === 'primary') {
                  aggregate.push(item.item.isPrimaryWeapon());
                } else if(filter.term === 'special') {
                  aggregate.push(item.item.isSpecialWeapon());
                } else if(filter.term === 'heavy') {
                  aggregate.push(item.item.isHeavyWeapon());
                } else if(filter.term === 'common') {
                  aggregate.push(item.item.isCommon());
                } else if(filter.term === 'uncommon') {
                  aggregate.push(item.item.isUncommon());
                } else if(filter.term === 'rare') {
                  aggregate.push(item.item.isRare());
                } else if(filter.term === 'legendary') {
                  aggregate.push(item.item.isLegendary());
                } else if(filter.term === 'exotic') {
                  aggregate.push(item.item.isExotic());
                } else if(filter.term === 'arc') {
                  aggregate.push(item.item.isArc());
                } else if(filter.term === 'solar') {
                  aggregate.push(item.item.isSolar());
                } else if(filter.term === 'void') {
                  aggregate.push(item.item.isVoid());
                } else if(filter.term === 'kinetic') {
                  aggregate.push(item.item.isKinetic());
                } else if(filter.term === 'shader') {
                  aggregate.push(item.item.isShader());
                } else if(filter.term === 'emblem') {
                  aggregate.push(item.item.isEmblem());
                } else if(filter.term === 'class') {
                  aggregate.push(item.item.isClassItem());
                } else if(filter.term === 'vehicle') {
                  aggregate.push(item.item.isVehicle());
                } else if(filter.term === 'ship') {
                  aggregate.push(item.item.isShip());
                } else if(filter.term === 'material') {
                  aggregate.push(item.item.isMaterial());
                } else if(filter.term === 'consumable') {
                  aggregate.push(item.item.isConsumable());
                }
              } else if (filter.type === 'fuzzy') {
                aggregate.push(filter.term.test(item.get('name')));
              }
            });

            if(aggregate.length) {
              var pass = aggregate.reduce(function(a, b) {
                return a && b;
              });

              if(pass) {
                filtered.push(item);
              }
            } else {
              filtered.push(item);
            }
          });

          component.setItems(filtered);
        }
      });
    }
  });
});
