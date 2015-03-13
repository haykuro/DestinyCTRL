define([
  'common/authorizer',
  'common/api',
  'models/account'
], function(Authorizer, API, Account) {
  function Bungie(apiKey, apiBase) {
    this.accounts = [];
    this.authed = false;
  }

  // Instance

  Bungie.prototype.authorize = function(provider) {
    var _authorizer = new Authorizer(provider);
    var _self = this;

    return new Promise(function(resolve, reject) {
      API.requestWithToken('GET', '/User/GetBungieNetUser')
        .then(function(user) {
          API.requestWithToken(
            'GET',
            '/User/GetBungieAccount/' +
            user.user.membershipId + '/0'
          ).then(function(user) {
            _self.authed = true;

            for(var accountIdx in user.destinyAccounts) {
              _self.accounts
                .push(new Account(user.destinyAccounts[accountIdx]));
            }

            resolve();
          }).catch(reject);
        }).catch(function() {
          _authorizer.attempt().then(function() {
            _self.authorize().then(function() {
              resolve();
            }).catch(reject);
          }).catch(reject);
        });
    });
  };

  Bungie.prototype.getAccounts = function() {
    return this.accounts;
  };

  return new Bungie();
});
