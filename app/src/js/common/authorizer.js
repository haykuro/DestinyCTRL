define([
  'common/api'
], function(API) {
  var Providers = {
    psn : 'https://www.bungie.net/en/User/SignIn/Psnid',
    xbl : 'https://www.bungie.net/en/User/SignIn/Wlid'
  };

  function Authorizer(provider) {
    this.token = '____destinyCTRL';
    this.provider = Providers[provider] + '#' + this.token;

    if(! this.provider) {
      throw new Error('Invalid authorization provider "' + provider + '"');
    }
  }

  Authorizer.prototype.attempt = function() {
    var _self = this;

    return new Promise(function(resolve, reject) {
      _self.cleanupWindows().then(function() {
        _self.openAuthWindow().then(function() {
          resolve();
        }).catch(reject);
      }).catch(reject);
    });
  };

  Authorizer.prototype.cleanupWindows = function() {
    var _self = this;

    return new Promise(function(resolve, reject) {
      var cleanup = function(windows) {
        windows.forEach(function(_window) {
          try {
            if(_window.type === 'popup' &&
              _window.tabs[0].url.indexOf(_self.token) > -1)
            {
              chrome.windows.remove(_window.id);
            }
          } catch(err) {
            reject(err);
          }
        });

        resolve();
      };

      try {
        chrome.windows.getAll({
          populate : true
        }, cleanup);
      } catch(err) {
        reject(err);
      }
    });
  };

  Authorizer.prototype.openAuthWindow = function() {
    var _self = this;

    return new Promise(function(resolve, reject) {
      var startInterval = function(_window) {
        var authCheckInterval = setInterval(function() {
          API.requestWithToken('GET', '/User/GetBungieNetUser')
            .then(function() {
              clearInterval(authCheckInterval);

              _self.cleanupWindows().then(function() {
                chrome.windows.remove(_window.id);
                window.location.reload();
              });
            }).catch(function(err) {
              if(err.ErrorCode !== 99) {
                clearInterval(authCheckInterval);

                reject('Error: DestinyCTRL failed to authenticate. Please reload.');
              }
            });
        }, 1000);
      };

      var sH = screen.availHeight;
      var sW = screen.availWidth;
      var wH = sH * 0.75 | 0;
      var wW = 325;

      try {
        chrome.windows.create({
          url : _self.provider,
          type : 'popup',
          width : wW,
          height : wH,
          top : Math.abs((wH / 2) - (sH / 2)) | 0,
          left : Math.abs((wW / 2) - (sW / 2)) | 0
        }, startInterval);
      } catch(err) {
        reject(err);
      }
    });
  };

  return Authorizer;
});
