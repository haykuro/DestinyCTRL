define(['models/item', 'models/equipment'], function(Item, Equipment) {
  function Bucket(definitions, repo) {
    var bucketMeta = definitions.buckets[repo.bucketHash];

    this.name = bucketMeta.bucketName;
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

  return Bucket;
});
