define(['models/item'], function(Item) {
  function Bucket(definitions, repo) {
    var bucketMeta = definitions.buckets[repo.bucketHash];

    this.name = bucketMeta.bucketName;
    this.order = bucketMeta.bucketOrder;
    this.description = bucketMeta.bucketDescription;
    this.items = [];

    for(var idx in repo.items) {
      var item = repo.items[idx];
      var itemMeta = definitions.items[item.itemHash];

      this.items.push(new Item(definitions, itemMeta));
    }
  }

  return Bucket;
});
