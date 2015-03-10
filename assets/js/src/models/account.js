define(['common/api', 'models/character', 'models/vault'], function(API, Character, Vault) {
  function Account(data) {
    var _self = this;

    this.id = data.userInfo.membershipId;
    this.type = data.userInfo.membershipType;
    this.lastPlayed = data.lastPlayed;
    this.grimoire = data.grimoireScore;
    this.avatar = 'https://www.bungie.net/' + data.userInfo.iconPath.replace(/^\//, '');
    this.characters = data.characters.map(function(char) {
      return new Character(_self, char);
    });
  }

  Account.prototype.isXBL = function() {
    return this.type === 1;
  };

  Account.prototype.isPSN = function() {
    return this.type === 2;
  };

  Account.prototype.getCharacters = function() {
    return this.characters;
  };

  Account.prototype.getVault = function() {
    var _self = this;

    return new Promise(function(resolve, reject) {
      API.requestWithToken(
        'GET',
        '/Destiny/' + _self.type +
        '/MyAccount/Vault',
        { definitions : true }
      ).then(function(resp) {
        var vault = new Vault(resp.definitions, resp.data);

        resolve(vault);
      }).catch(reject);
    });
  }

  return Account;
});
