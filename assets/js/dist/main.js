(function () {/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                //Lop off the last part of baseParts, so that . matches the
                //"directory" and not name of the baseName's module. For instance,
                //baseName of "one/two/three", maps to "one/two/three.js", but we
                //want the directory, "one/two" for this normalization.
                name = baseParts.slice(0, baseParts.length - 1).concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("vendor/almond", function(){});

define('common/utils',[],function() {
  function Util() {}

  Util.getCookie = function(name) {
    return new Promise(function(resolve, reject) {
      if(window.hasOwnProperty('chrome') && chrome.hasOwnProperty('cookies')) {
        chrome.cookies.get({
          name : name,
          url : 'https://www.bungie.net'
        }, function(cookie) {
          if(cookie) {
            resolve(cookie.value);
          } else {
            reject(Util.createError('Cookie does not exist'));
          }
        }.bind(this));
      }
      else {
        reject(Util.createError('Browser is not supported'));
      }
    }.bind(this));
  };

  Util.logError = function(err) {
    if(err instanceof Error) {
      throw err;
    } else {
      console.error('Error[' + err.ErrorCode + '] -> "' + err.Message + '"');
    }
  };

  Util.createError = function(msg, code) {
    return {
      ErrorCode : msg.ErrorCode || code || -1,
      Message : msg.Message || msg
    };
  };

  return Util;
});

define('common/api',['common/utils'], function(Util) {
  function API() {}

  API.key = null;
  API.base = 'https://www.bungie.net/Platform';

  API.requestWithToken = function() {
    var _self = this;
    var _args = [].slice.call(arguments);

    return new Promise(function(resolve, reject) {
      Util.getCookie('bungled').then(function(csrfToken) {
        var _deleteCSRF = function() {
          delete _self._csrf;
        };

        _self._csrf = csrfToken;

        API.request.apply(_self, _args)
          .then(resolve)
          .then(_deleteCSRF)
          .catch(reject);
      }).catch(reject);
    });
  };

  API.request = function(method, endpoint, params, payload) {
    var _self = this;

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.onload = function() {
        var raw = this.response;
        var resp = JSON.parse(raw);

        if (this.status >= 200 && this.status < 400) {
          if(resp.ErrorCode > 1) {
            reject(resp);
          }
          else {
            resolve(resp.Response);
          }
        } else {
          reject(resp);
        }
      };

      xhr.onerror = function() {
        var raw = this.response
        var resp = JSON.parse(raw);

        reject(resp);
      };

      var url = [
        API.base.replace(/(\/$)/, ''),
        endpoint.replace(/(^\/|\/$)/, '')
      ].join('/') + '/' + API.objectToQueryString(params || {});

      xhr.open(method, url, true);

      if(_self._csrf) {
        xhr.withCredentials = true;

        xhr.setRequestHeader('X-CSRF', _self._csrf);
      }

      xhr.setRequestHeader('X-API-Key', API.key);

      xhr.send(payload);
    });
  };

  API.objectToQueryString = function(obj) {
    var params = [];

    for(var key in obj) {
      params.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }

    return params ? '?' + params.join('&') : '';
  };

  return API;
});

define('models/equipment',[],function() {
  function createStat(stat, meta) {
    return {
      name : meta.statName,
      value : stat.value,
      description : meta.statDescription,
      icon : 'https://www.bungie.net/' + meta.icon.replace(/^\//, '')
    };
  }

  function Equipment(definitions, repo) {
    var meta = definitions.items[repo.itemHash];

    this.id = repo.itemHash;
    this.name = meta.itemName;
    this.type = meta.itemType;
    this.typeName = meta.itemTypeName;
    this.level = repo.itemLevel;
    this.description = meta.itemDescription;
    this.icon = 'https://www.bungie.net/' + meta.icon.replace(/^\//, '');
    this.stats = {};
    this.primaryStatId = null;
    this.talentGrid = [];
    this.tier = { type : meta.tierType, name : meta.tierTypeName };

    console.log(meta);

    this._definitions = definitions;

    if(repo.baseStats) {
      this._fillBaseStats(repo.baseStats);
    }

    if(meta.primaryBaseStat) {
      this._fillPrimaryStat(meta.primaryBaseStat);
    }

    if(repo.nodes) {
      this._fillTalentGrid(
        repo.nodes,
        definitions.talentGrids[meta.talentGridHash]
      );
    }

    delete this._definitions;
  }

  Equipment.prototype._fillBaseStats = function(stats) {
    stats.forEach(function(stat) {
      var meta = this._definitions.stats[stat.statHash];

      this.stats[meta.statIdentifier] = createStat(stat, meta);
    }, this);
  };

  Equipment.prototype._fillPrimaryStat = function(stat) {
    var meta = this._definitions.stats[stat.statHash];

    this.primaryStatId = meta.statIdentifier;

    this.stats[this.primaryStatId] = createStat(stat, meta);
  };

  Equipment.prototype._fillTalentGrid = function(itemNodes, talentGrid) {
    itemNodes.map(function(node, idx) {
      // The talentGrid maps 1:1 to an
      // item's "nodes"; Thanks for the confusing
      // definitions Bungie!

      var talentNode = talentGrid.nodes[idx];
      var step = talentNode.steps[node.stepIndex];

      return {
        name : step.nodeStepName,
        description : step.nodeStepDescription,
        icon : 'https://www.bungie.net/' + step.icon.replace(/^\//, ''),
        requirements : step.activationRequirement,
        active : node.isActivated,

        // We need the row-column data from the
        // talentGridNode to properly build our
        // items progression matrix, order isn't
        // important (we sort that out later)

        row : talentNode.row,
        column : talentNode.column
      };
    }).forEach(function(node) {
      // We only want rows and columns that
      // are greater than 1, from what I can
      // tell anything but that isn't used

      if(node.row > -1 && node.column > -1) {
        // Build our column-row matrix, again,
        // not worrying about sort order as we
        // will handle that later

        if(! this.talentGrid.hasOwnProperty(node.column)) {
          this.talentGrid[node.column] = [];
        }

        this.talentGrid[node.column].push(node);
      }
    }, this);

    // Sort the row columns just in case
    // we have them in the wrong order from
    // the previous operations

    this.talentGrid.forEach(function(column) {
      column.sort(function(a, b) {
        return a.row - b.row;
      });
    });
  }

  return Equipment;
});

define('models/character',['common/api', 'models/equipment'], function(API, Equipment) {
  function Character(account, data) {
    this._account = account;

    this.id = data.characterId;
    this.emblem = null;
    this.background = null;
    this.level = 0;
    this.equipment = [];
    this.inventory = [];

    // this.sync();
  }

  Character.prototype.sync = function() {
    var _self = this;

    API.requestWithToken(
      'GET',
      '/Destiny/' + _self._account.type +
      '/Account/' + _self._account.id +
      '/Character/' + _self.id,
      { definitions : true }
    ).then(function(resp) {
      var repo = resp.data;
      var definitions = resp.definitions;

      _self.level = repo.characterLevel;
      _self.emblem = 'https://www.bungie.net/' +
        repo.emblemPath.replace(/^\//, '');
      _self.background = 'https://www.bungie.net/' +
        repo.backgroundPath.replace(/^\//, '');
      _self.equipment = repo.characterBase
        .peerView.equipment.map(function(equipment) {
          var item = definitions.items[equipment.itemHash];

          return new Equipment(definitions, item);
        });
    });
  };

  Character.prototype.getEquipment = function() {
    return this.equipment;
  };

  Character.prototype.getInventory = function() {
    return this.inventory;
  };

  return Character;
});

define('models/item',[],function() {
  function Item(definitions, repo) {
    var meta = definitions.items[repo.itemHash];

    this.id = repo.itemHash;
    this.name = meta.itemName;
    this.description = meta.itemDescription;
    this.icon = 'https://www.bungie.net/' + meta.icon.replace(/^\//, '');
    this.stackSize = repo.stackSize;
    this.type = meta.itemType;
    this.typeName = meta.itemTypeName;
    this.tier = { type : meta.tierType, name : meta.tierName };
  }

  Item.prototype.isMaterial = function() {
    return this.type === 0;
  };

  Item.prototype.isConsumable = function() {
    return this.type === 9;
  };

  return Item;
});

define('models/bucket',['models/item', 'models/equipment'], function(Item, Equipment) {
  function Bucket(definitions, repo) {
    var bucketMeta = definitions.buckets[repo.bucketHash];

    this.id = repo.bucketHash;
    this.name = bucketMeta.bucketName;
    this.type = bucketMeta.bucketIdentifier;
    this.order = bucketMeta.bucketOrder;
    this.description = bucketMeta.bucketDescription;
    this.items = [];

    for(var idx in repo.items) {
      var item = repo.items[idx];

      if(item.isEquipment) {
        this.items.push(new Equipment(definitions, item));
      } else {
        this.items.push(new Item(definitions, item));
      }
    }
  }

  Bucket.prototype.getItems = function() {
    return this.items;
  };

  return Bucket;
});

define('models/vault',['models/bucket'], function(Bucket) {
  function Vault(definitions, repo) {
    this.buckets = repo.buckets.map(function(bucket) {
      return new Bucket(definitions, bucket);
    }).sort(function(a, b) {
      return a.order - b.order;
    });
  }

  Vault.prototype._getBucketByType = function(type) {
    var _bucket = null;

    this.buckets.some(function(bucket) {
      if(bucket.type === type) {
        _bucket = bucket;

        return true;
      }

      return false;
    });

    return _bucket;
  };

  Vault.prototype.getAll = function() {
    return this.buckets.reduce(function(memo, bucket) {
      return memo.concat([bucket]);
    }, []);
  };

  Vault.prototype.getGeneral = function() {
    return this._getBucketByType('BUCKET_VAULT_ITEMS');
  };

  Vault.prototype.getWeapons = function() {
    return this._getBucketByType('BUCKET_VAULT_WEAPONS');
  };

  Vault.prototype.getArmor = function() {
    return this._getBucketByType('BUCKET_VAULT_ARMOR');
  };

  return Vault;
});

define(
  'models/account',['common/api', 'models/character', 'models/vault'],
  function(API, Character, Vault) {
    function Account(data) {
      var _self = this;

      this.id = data.userInfo.membershipId;
      this.type = data.userInfo.membershipType;
      this.lastPlayed = data.lastPlayed;
      this.grimoire = data.grimoireScore;
      this.avatar = 'https://www.bungie.net/' +
        data.userInfo.iconPath.replace(/^\//, '');
      this.characters = data.characters.map(function(char) {
        return new Character(_self, char);
      });
    }

    Account.prototype.isXBL = function() {
      return this.type === 1;
    };

    Account.prototype.isPSN = function() {
      return this.type === 2;
    };

    Account.prototype.getCharacters = function() {
      return this.characters;
    };

    Account.prototype.getVault = function() {
      var _self = this;

      return new Promise(function(resolve, reject) {
        API.requestWithToken(
          'GET',
          '/Destiny/' + _self.type +
          '/MyAccount/Vault',
          { definitions : true }
        ).then(function(resp) {
          var vault = new Vault(resp.definitions, resp.data);

          resolve(vault);
        }).catch(reject);
      });
    }

    return Account;
  }
);

define('common/bungie',['common/utils', 'common/api', 'models/account'], function(Util, API, Account) {
  function Bungie(apiKey, apiBase) {
    if(apiKey) {
      API.key = apiKey;
    }

    if(apiBase) {
      API.base = apiBase;
    }

    this._accounts = [];
    this._authed = false;
  }

  // Instance

  Bungie.prototype.authorize = function() {
    var _self = this;

    return new Promise(function(resolve, reject) {
      API.requestWithToken('GET', '/User/GetBungieNetUser')
        .then(function(user) {
          API.requestWithToken(
            'GET',
            '/User/GetBungieAccount/' +
            user.user.membershipId + '/0'
          ).then(function(user) {
            _self._authed = true;

            for(var accountIdx in user.destinyAccounts) {
              _self._accounts
                .push(new Account(user.destinyAccounts[accountIdx]));
            }

            resolve();
          }).catch(reject);
        }).catch(reject);
    });
  };

  Bungie.prototype.getAccounts = function() {
    return this._accounts;
  };

  return new Bungie();
});

define('DestinyCTRL',['common/bungie'], function(Bungie) {
  function DestinyCTRL() {}

  DestinyCTRL.initialize = function() {
    var _self = this;

    Bungie.authorize().then(function() {
      var accounts = Bungie.getAccounts();

      if(accounts.length) {
        accounts[0].getVault().then(function(vault) {
          var $vault = $('#vault');

          vault.getAll().forEach(function(bucket) {
            var $bucket = $('<ul id="' + bucket.type + '" />');

            bucket.getItems().forEach(function(item) {
              var $item = $('<li />');
              var $icon = $('<img />').attr('src', item.icon);

              // console.log(item);

              $item.append($icon);
              $bucket.append($item);
            });

            $vault.append($bucket);
          });
        });
      }
    }).catch(function(err) {
      alert(err.Message);
    });
  };

  return DestinyCTRL;
});

require(['common/utils', 'DestinyCTRL'], function(Util, DestinyCTRL) {
  if(window.hasOwnProperty('chrome')) {
    chrome.browserAction.onClicked.addListener(function() {
      var index = chrome.extension.getURL('index.html');
      var query = function(tabs) {
        try {
          if(tabs.length) {
            chrome.tabs.update(tabs[0].id, {
              active : true
            });
          } else {
            chrome.tabs.create({
              url : index
            });
          }
        } catch(err)  {
          Util.handleError(err);
        }
      };

      try {
        chrome.tabs.query({ url : index }, query);
      } catch (err) {
        Util.handleError(err);
      }
    });
  } else {
    throw new Error('Browser not supported');
  }

  DestinyCTRL.initialize();
});

define("main", function(){});

}());
//# sourceMappingURL=main.js.map