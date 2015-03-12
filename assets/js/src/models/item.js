define(function() {
  function Item(definitions, repo) {
    var meta = definitions.items[repo.itemHash];

    this.id = repo.itemHash;
    this.name = meta.itemName;
    this.description = meta.itemDescription;
    this.icon = 'https://www.bungie.net/' + meta.icon.replace(/^\//, '');
    this.stackSize = repo.stackSize;
    this.tier = { type : meta.tierType, name : meta.tierName };
    this.type = {
      metaType : meta.itemType,
      metaTypeName : meta.itemTypeName,
      bucket : definitions.buckets[meta.bucketTypeHash].bucketIdentifier
        .replace(/^BUCKET_/, '')
    };
  }

  Item.prototype.isMaterial = function() {
    return this.type.bucket === 'MATERIALS';
  };

  Item.prototype.isConsumable = function() {
    return this.type.bucket === 'CONSUMABLES';
  };

  return Item;
});
