define([
  'models/bucket'
], function(Bucket) {
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
