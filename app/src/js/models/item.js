define(function() {
  function Item(definitions, repo) {
    var meta = definitions.items[repo.itemHash];

    this.id = repo.itemHash;
    this.name = meta.itemName;
    this.description = meta.itemDescription;
    this.icon = 'https://www.bungie.net/' + meta.icon.replace(/^\//, '');
    this.stackSize = repo.stackSize;
    this.tier = {
      type : meta.tierType, name : meta.tierTypeName
    };
    this.type = {
      bucket : definitions.buckets[meta.bucketTypeHash].bucketIdentifier
        .replace(/^BUCKET_/, '')
    };
  }

  Item.prototype.isArmor = function() {
    return this.isHeadArmor() ||
      this.isChestArmor() ||
      this.isArmArmor() ||
      this.isLegArmor();
  };

  Item.prototype.isWeapon = function() {
    return this.isPrimaryWeapon() ||
      this.isSpecialWeapon() ||
      this.isHeavyWeapon();
  };

  Item.prototype.isGeneral = function() {
    return ! this.isWeapon() && ! this.isArmor();
  };

  Item.prototype.isMaterial = function() {
    return this.type.bucket === 'MATERIALS';
  };

  Item.prototype.isConsumable = function() {
    return this.type.bucket === 'CONSUMABLES';
  };

  Item.prototype.isHeadArmor = function() {
    return this.type.bucket === 'HEAD';
  };

  Item.prototype.isChestArmor = function() {
    return this.type.bucket === 'CHEST';
  };

  Item.prototype.isArmArmor = function() {
    return this.type.bucket === 'ARMS';
  };

  Item.prototype.isLegArmor = function() {
    return this.type.bucket === 'LEGS';
  };

  Item.prototype.isPrimaryWeapon = function() {
    return this.type.bucket === 'PRIMARY_WEAPON';
  };

  Item.prototype.isSpecialWeapon = function() {
    return this.type.bucket === 'SPECIAL_WEAPON';
  };

  Item.prototype.isHeavyWeapon = function() {
    return this.type.bucket === 'HEAVY_WEAPON';
  };

  Item.prototype.isShader = function() {
    return this.type.bucket === 'SHADER';
  };

  Item.prototype.isEmblem = function() {
    return this.type.bucket === 'EMBLEM';
  };

  Item.prototype.isClassItem = function() {
    return this.type.bucket === 'CLASS_ITEMS';
  };

  Item.prototype.isVehicle = function() {
    return this.type.bucket === 'VEHICLE';
  };

  Item.prototype.isShip = function() {
    return this.type.bucket === 'SHIP';
  };

  return Item;
});
