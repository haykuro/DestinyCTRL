define([
  'common/component',
  'vendor/stapes',
  'common/utils'
], function(Component, Stapes, _) {
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

  var Filterer = Stapes.subclass({
    constructor : function(component, mapping) {
      this.items = [];
      this.component = component;
      this.mapping = {
        get : mapping.get || 'getItems',
        set : mapping.set || 'setItems'
      };

      this.update();
    },
    update : function() {
      var map = this.mapping;
      var getter;

      if(typeof map.get === 'string') {
        getter = this.component[map.get];
      } else if(typeof map.get === 'function') {
        getter = map.get;
      }

      if(! getter) {
        throw new Error('Invalid getter supplied');
      }

      this.items = getter.call(this.component);
    },
    get : function() {
      return this.items;
    },
    set : function(items) {
      var map = this.mapping;

      if(typeof map.set === 'string') {
        this.component[map.set](items);
      } else if(typeof map.set === 'function') {
        map.set.call(this.component, items, this.items);
      }
    }
  }, true);

  var FilterComp = Component.subclass({
    constructor : function() {
      this.set({
        components : []
      }, true);

      this.on('change:search', this.filterComponents);
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
            }, 125));
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

    updateItemCache : function() {
      var components = this.get('components') || [];

      components.reduce(function(memo, component) {
        return memo.concat(component.get('__filters') || []);
      }, []).forEach(function(filterer) {
        filterer.update();
      });
    },

    addComponent : function(component, mapping) {
      if(component instanceof Component) {
        var components = this.get('components') || [];
        var filters = component.get('__filters') || [];

        filters.push(new Filterer(component, mapping || {}));

        component.set('__filters', filters, true);
        components.push(component);

        this.set('components', components, true);
        this.updateItemCache();
      }
    },

    filterComponents : function(query) {
      var filters = this.parseFilters(query);
      var components = this.get('components') || [];

      components.reduce(function(memo, component) {
        return memo.concat(component.get('__filters') || []);
      }, []).forEach(function(filterer) {
        var filtered = [];

        filterer.get().forEach(function(item) {
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

        filterer.set(filtered);
      });
    }
  });

  return new FilterComp();
});
