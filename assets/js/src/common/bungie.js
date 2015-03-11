define(['common/utils', 'common/api', 'models/account'], function(Util, API, Account) {
  function Bungie(apiKey, apiBase) {
    if(apiKey) {
      API.key = apiKey;
    }

    if(apiBase) {
      API.base = apiBase;
    }

    this._accounts = [];
    this._authed = false;
  }

  // Instance

  Bungie.prototype.authorize = function() {
    var _self = this;

    return new Promise(function(resolve, reject) {
      API.requestWithToken('GET', '/User/GetBungieNetUser')
        .then(function(user) {
          API.requestWithToken(
            'GET',
            '/User/GetBungieAccount/' +
            user.user.membershipId + '/0'
          ).then(function(user) {
            _self._authed = true;

            for(var accountIdx in user.destinyAccounts) {
              _self._accounts
                .push(new Account(user.destinyAccounts[accountIdx]));
            }

            resolve();
          }).catch(reject);
        }).catch(reject);
    });
  };

  Bungie.prototype.getAccounts = function() {
    return this._accounts;
  };

  return new Bungie();
});
