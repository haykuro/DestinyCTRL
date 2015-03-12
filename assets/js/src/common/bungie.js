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
        }).catch(function() {
          // Just handling PSN for now because i'm lazy...
          // other authentication options will com later...

          var signInUrl =
            'https://www.bungie.net/en/User/SignIn/Psnid#____destinyCTRL';

          var openAuthWindow = function() {
            var sH = screen.availHeight;
            var sW = screen.availWidth;
            var wH = sH * 0.75 | 0;
            var wW = 300;

            chrome.windows.create({
              url : signInUrl,
              type : 'popup',
              width : wW,
              height : wH,
              top : Math.abs((wH / 2) - (sH / 2)) | 0,
              left : Math.abs((wW / 2) - (sW / 2)) | 0
            }, function(_window) {
              var authCheck = setInterval(function() {
                API.requestWithToken('GET', '/User/GetBungieNetUser')
                  .then(function() {
                    clearInterval(authCheck);
                    chrome.windows.remove(_window.id);
                    window.location.reload();
                  }).catch(function(err) {
                    if(err.ErrorCode !== 99) {
                      clearInterval(authCheck);
                      alert('Something went wrong, refesh the page.');
                    }
                  });
              }, 1000);
            });
          };

          chrome.windows.getAll({
            populate : true
          }, function(windows) {
            windows.forEach(function(_window) {
              var isPopup = _window.type === 'popup';
              var isDCTRL = _window.tabs[0].url.indexOf('#____destinyCTRL') > -1;

              if(isPopup && isDCTRL) {
                chrome.windows.remove(_window.id);
              }
            });

            openAuthWindow();
          });
        });
    });
  };

  Bungie.prototype.getAccounts = function() {
    return this._accounts;
  };

  return new Bungie();
});
