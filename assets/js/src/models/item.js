define(['models/bucket'], function(Bucket) {
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
