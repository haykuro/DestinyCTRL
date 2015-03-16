define([
  'common/api',
  'models/equipment'
], function(API, Equipment) {
  function Character(account, data) {
    this._account = account;

    this.id = data.characterId;
    this.emblem = null;
    this.background = null;
    this.level = 0;
    this.equipment = [];
    this.inventory = [];

    //this.sync();
  }

  Character.prototype.sync = function() {
    var _self = this;

    return API.requestWithToken(
      'GET',
      '/Destiny/' + _self._account.type +
      '/Account/' + _self._account.id +
      '/Character/' + _self.id,
      { definitions : true }
    ).then(function(resp) {
      var repo = resp.data;
      var definitions = resp.definitions;

      _self.level = repo.characterLevel;
      _self.emblem = 'https://www.bungie.net/' +
        repo.emblemPath.replace(/^\//, '');
      _self.background = 'https://www.bungie.net/' +
        repo.backgroundPath.replace(/^\//, '');
      _self.equipment = repo.characterBase
        .peerView.equipment.map(function(equipment) {
          var item = definitions.items[equipment.itemHash];

          return new Equipment(definitions, item);
        });
    });
  };

  Character.prototype.getEquipment = function() {
    return this.equipment;
  };

  Character.prototype.getInventory = function() {
    return this.inventory;
  };

  return Character;
});
