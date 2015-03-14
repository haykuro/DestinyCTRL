define(
  ['common/bungie', 'common/component', 'modules/item'],
  function(Bungie, Component, ItemModule) {
    function regexEscape(str) {
      return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

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
        var _self = this;
        var items = this.items();
        var itemViews = items.map(function(item) {
          return item.view();
        });

        return [
          m("h1", this.get('title')),
          m('input[type=text]', {
            onkeyup : m.withAttr('value', function(value) {
              _self.set('search', value);
            })
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

        var parts = query.split(' ').filter(function(part) {
          return part.length;
        });

        return parts.map(function(term) {
          var built = {};

          if(term.indexOf('type:') > -1) {
            built.type = 'type';
            built.term = term.replace(/^type:/, '');
          } else if(term.indexOf('tier:') > -1) {
            built.type = 'tier';
            built.term = term.replace(/^tier:/, '');
          } else if(term.length > 0) {
            var strParts = term.split('').map(regexEscape);

            built.type = 'fuzzy';
            built.term = new RegExp(
              strParts.length ?
                strParts.reduce(function(a, b) {
                  return a + '[^' + b + ']*' + b;
                }) :
                regexEscape(term) + '*?',
              ['i']
            );
          }

          return built;
        })
      }
    });

    return VaultModule;
  }
);
