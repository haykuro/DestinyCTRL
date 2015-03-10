define(['common/api'], function(API) {
  function Character(account, data) {
    this._account = account;

    this.id = data.characterId;
  }

  Character.prototype.getGear = function() {
    var _self = this;

    return new Promise(function(resolve, reject) {
      API.request(
        'GET',
        '/Destiny/' + _self._account.type +
        '/Account/' + _self._account.id +
        '/Character/' + _self.id,
        { definitions : true }
      ).then(resolve).catch(reject);
    });
  };

  Character.prototype.getInventory = function() {
    //
  };

  return Character;
});
