define(['models/item', 'models/equipment'], function(Item, Equipment) {
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

  Bucket.prototype.getItems = function(filter) {
    if(typeof filter === 'string') {
      return this.items.filter(function(item) {
        return item.type.bucket === filter;
      });
    } else if(typeof filter === 'function') {
      return this.items.filter(filter);
    }

    return this.items;
  };

  return Bucket;
});
