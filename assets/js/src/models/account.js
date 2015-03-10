define(['models/character', 'common/api'], function(Character, API) {
  function Account(data) {
    this.id = data.userInfo.membershipId;
    this.type = data.userInfo.membershipType;
    this.lastPlayed = data.lastPlayed;
    this.grimoire = data.grimoireScore;
    this.avatar = 'https://www.bungie.net/' + data.userInfo.iconPath.replace(/^\//, '');
    this.characters = data.characters.map(function(char) {
      return new Character(char);
    });
  }

  Account.prototype.isXBL = function() {
    return this.type === 1;
  };

  Account.prototype.isPSN = function() {
    return this.type === 2;
  };

  Account.prototype.getVault = function() {
    var _self = this;

    return new Promise(function(resolve, reject) {
      API.requestWithToken(
        'GET',
        '/Destiny/' + _self.type +
        '/MyAccount/Vault',
        { definitions : true }
      ).then(resolve).catch(reject);
    });
  }

  return Account;
});
