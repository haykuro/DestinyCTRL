define(['models/item'], function(Item) {
  function Bucket(definitions, repo) {
    var bucketMeta = definitions.buckets[repo.bucketHash];

    this.name = bucketMeta.bucketName;
    this.order = bucketMeta.bucketOrder;
    this.description = bucketMeta.bucketDescription;
    this.items = [];

    for(var idx in repo.items) {
      this.items.push(new Item(definitions, repo.items[idx]));
    }
  }

  return Bucket;
});
