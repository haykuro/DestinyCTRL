define(
  ['common/bungie', 'common/component', 'modules/item', 'common/utils'],
  function(Bungie, Component, ItemModule, _) {
    function regexEscape(str) {
      return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    function withAttrDebounce(prop, func, wait, immediate) {
      return m.withAttr(prop, _.debounce(func, wait, immediate));
    }

    var validTypes = ['weapon', 'armor', 'general'];
    var validTiers = ['common', 'uncommon', 'rare', 'legendary', 'exotic'];

    var VaultModule = Component.subclass({
      constructor : function(vault) {
        this.set({
          title : 'Vault',
          items : [],
          filtered : [],
          filtering : false
        }, true);

        var buckets = vault.getAll();

        if(buckets.length) {
          this.set('items', buckets.reduce(function(memo, bucket) {
            return memo.concat(bucket.getItems());
          }, []).map(function(item) {
            return new ItemModule(item, true);
          }));
        }

        this.on('change:search', function(query) {
          var items = this.get('items');
          var terms = this.buildSearch(query);
          var filtered = [];

          if(terms.length) {
            this.set('filtering', true);
          } else {
            this.set('filtering', false);
          }

          items.forEach(function(item) {
            var aggregate = [];

            terms.forEach(function(term) {
              if(term.type === 'type') {
                if(term.term === 'weapon') {
                  aggregate.push(item.item.isWeapon());
                } else if(term.term === 'armor') {
                  aggregate.push(item.item.isArmor());
                } else if(term.term === 'general') {
                  aggregate.push(item.item.isGeneral())
                }
              } else if(term.type === 'tier') {
                if(term.term === 'common') {
                  aggregate.push(item.item.isCommon());
                } else if(term.term === 'uncommon') {
                  aggregate.push(item.item.isUncommon());
                } else if(term.term === 'rare') {
                  aggregate.push(item.item.isRare());
                } else if(term.term === 'legendary') {
                  aggregate.push(item.item.isLegendary());
                } else if(term.term === 'exotic') {
                  aggregate.push(item.item.isExotic());
                }
              } else if (term.type === 'fuzzy') {
                aggregate.push(term.term.test(item.get('name')));
              }
            });

            if(aggregate.length) {
              var pass = aggregate.reduce(function(a, b) {
                return a && b;
              });

              if(pass) {
                filtered.push(item);
              }
            }
          });

          this.set('filtered', filtered);
        });
      },

      view : function() {
        var self = this;
        var items = this.items();
        var itemViews = items.map(function(item) {
          return item.view();
        });

        return [
          m("h1", this.get('title')),
          m('input[type=text]', {
            config : function(el, redraw) {
              if(! redraw) {
                el.addEventListener('keyup', _.throttle(function() {
                  self.set('search', this.value);
                  m.redraw.strategy('diff');
                  m.redraw();
                }, 250));
              }
            }
          }),
          m('ul.items', itemViews)
        ];
      },

      items : function() {
        var items = this.get('items');
        var filtered = this.get('filtered');
        var filtering = this.get('filtering');

        return filtering ? filtered : items;
      },

      buildSearch : function(query) {
        if(query.length === 0) {
          return [];
        }

        var search = query.split(' ').filter(function(part) {
          return part.length;
        });

        return search.map(function(expression) {
          expression = expression.toLowerCase();

          var builtExpr = {};

          if(expression.indexOf('type:') > -1) {
            builtExpr.type = 'type';
            builtExpr.term = expression.replace(/^type:/, '');
          } else if(expression.indexOf('tier:') > -1) {
            builtExpr.type = 'tier';
            builtExpr.term = expression.replace(/^tier:/, '');
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

          if(builtExpr.type === 'type') {
            valid = validTypes.indexOf(builtExpr.term) > -1
          } else if(builtExpr.type === 'tier') {
            valid = validTiers.indexOf(builtExpr.term) > -1
          }

          return valid;
        });
      }
    });

    return VaultModule;
  }
);
