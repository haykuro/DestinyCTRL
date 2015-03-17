define([
  'common/api',
  'models/equipment',
  'models/bucket'
], function(API, Equipment, Bucket) {
  var equipmentBuckets = [
    'BUCKET_BUILD','BUCKET_PRIMARY_WEAPON',
    'BUCKET_SPECIAL_WEAPON','BUCKET_HEAVY_WEAPON',
    'BUCKET_HEAD','BUCKET_ARMS',
    'BUCKET_CHEST', 'BUCKET_LEGS',
    'BUCKET_CLASS_ITEMS', 'BUCKET_GHOST',
    'BUCKET_VEHICLE', 'BUCKET_SHIP',
    'BUCKET_SHADER', 'BUCKET_EMBLEM'
  ];

  function Character(account, data) {
    this.account = account;

    this.id = data.characterId;
    this.emblem = null;
    this.background = null;
    this.level = 0;
    this.buckets = [];
  }

  Character.prototype.sync = function() {
    return Promise.all([
      this._syncClass(),
      this._syncInventory()
    ]);
  };

  Character.prototype.getInventory = function() {
    return this.buckets.reduce(function(memo, bucket) {
      return memo.concat(bucket.getItems());
    }, []);
  };

  Character.prototype.getEquipment = function(isEquipped) {
    return this.buckets.filter(function(bucket) {
      return equipmentBuckets.indexOf(bucket.type) > -1;
    }).reduce(function(memo, bucket) {
      var items = bucket.getItems();

      if(typeof isEquipped === 'boolean') {
        items = items.filter(function(item) {
          return item.isEquipped === isEquipped;
        });
      }

      return memo.concat(items);
    }, []);
  };

  Character.prototype.getMarks = function(type) {
    if(type === 'pvp') {
      return this._getBucketByType('BUCKET_CURRENCY_FACTION_PVP');
    }

    return this._getBucketByType('BUCKET_CURRENCY_FACTION_PVE');
  };

  Character.prototype.getMessages = function() {
    return this._getBucketByType('BUCKET_MESSAGES');
  };

  Character.prototype.getRecovery = function() {
    return this._getBucketByType('BUCKET_RECOVERY');
  };

  Character.prototype.getBuild = function() {
    return this._getBucketByType('BUCKET_BUILD');
  };

  Character.prototype.getPrimaryWeapons = function() {
    return this._getBucketByType('BUCKET_PRIMARY_WEAPON');
  };

  Character.prototype.getSpecialWeapons = function() {
    return this._getBucketByType('BUCKET_SPECIAL_WEAPON');
  };

  Character.prototype.getHeavyWeapons = function() {
    return this._getBucketByType('BUCKET_HEAVY_WEAPON');
  };

  Character.prototype.getHeadArmor = function() {
    return this._getBucketByType('BUCKET_HEAD');
  };

  Character.prototype.getArmArmor = function() {
    return this._getBucketByType('BUCKET_ARMS');
  };

  Character.prototype.getChestArmor = function() {
    return this._getBucketByType('BUCKET_CHEST');
  };

  Character.prototype.getLegArmor = function() {
    return this._getBucketByType('BUCKET_LEGS');
  };

  Character.prototype.getClassItems = function() {
    return this._getBucketByType('BUCKET_CLASS_ITEMS');
  };

  Character.prototype.getGhosts = function() {
    return this._getBucketByType('BUCKET_GHOST');
  };

  Character.prototype.getVehicles = function() {
    return this._getBucketByType('BUCKET_VEHICLE');
  };

  Character.prototype.getShips = function() {
    return this._getBucketByType('BUCKET_SHIP');
  };

  Character.prototype.getShaders = function() {
    return this._getBucketByType('BUCKET_SHADER');
  };

  Character.prototype.getEmblems = function() {
    return this._getBucketByType('BUCKET_EMBLEM');
  };

  Character.prototype.getMaterials = function() {
    return this._getBucketByType('BUCKET_MATERIALS');
  };

  Character.prototype.getConsumables = function() {
    return this._getBucketByType('BUCKET_CONSUMABLES');
  };

  Character.prototype.getMissions = function() {
    return this._getBucketByType('BUCKET_MISSION');
  };

  Character.prototype.getBounties = function() {
    return this._getBucketByType('BUCKET_BOUNTIES');
  };

  Character.prototype._syncClass = function() {
    var self = this;

    return API.requestWithToken(
      'GET',
      '/Destiny/' + self.account.type +
      '/Account/' + self.account.id +
      '/Character/' + self.id,
      { definitions : true }
    ).then(function(resp) {
      var repo = resp.data;
      var definitions = resp.definitions;

      self.level = repo.characterLevel;
      self.emblem = 'https://www.bungie.net/' +
        repo.emblemPath.replace(/^\//, '');
      self.background = 'https://www.bungie.net/' +
        repo.backgroundPath.replace(/^\//, '');

      var classHash = repo.characterBase.classHash;
      var classDef = definitions.classes[classHash];

      self.characterClass = {
        type : repo.characterBase.classType,
        name : classDef.className,
        gender : repo.characterBase.genderType
      };
    });
  };

  Character.prototype._syncInventory = function() {
    var self = this;

    return API.requestWithToken(
      'GET',
      '/Destiny/' + self.account.type +
      '/Account/' + self.account.id +
      '/Character/' + self.id +
      '/Inventory',
      { definitions : true }
    ).then(function(resp) {
      var data = resp.data.buckets;
      var definitions = resp.definitions;

      Object.keys(data).forEach(function(key) {
        Object.keys(data[key] || {}).map(function(bucketKey) {
          return data[key][bucketKey];
        }).forEach(function(bucket) {
          self.buckets.push(new Bucket(definitions, bucket));
        });
      });
    });
  };

  Character.prototype._getBucketByType = function(type) {
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

  return Character;
});
