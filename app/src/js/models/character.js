define([
  'common/api',
  'models/equipment',
  'models/bucket'
], function(API, Equipment, Bucket) {
  function Character(account, data) {
    this.account = account;

    this.id = data.characterId;
    this.emblem = null;
    this.background = null;
    this.level = 0;
    this.buckets = [];
  }

  Character.prototype.sync = function() {
    var self = this;

    return Promise.all([
      this._syncClass(),
      this._syncInventory()
    ]);
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

  Character.prototype.getInventory = function() {
    return this.buckets.reduce(function(memo, bucket) {
      return memo.concat(bucket.getItems());
    }, []);
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

  return Character;
});
