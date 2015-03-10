define(function() {
  function Util() {}

  Util.getCookie = function(name) {
    return new Promise(function(resolve, reject) {
      if(window.hasOwnProperty('chrome') && chrome.hasOwnProperty('cookies')) {
        chrome.cookies.get({
          name : name,
          url : 'https://www.bungie.net'
        }, function(cookie) {
          if(cookie) {
            resolve(cookie.value);
          } else {
            reject();
          }
        }.bind(this));
      }
      else {
        reject();
      }
    }.bind(this));
  };

  Util.logError = function(err) {
    if(err instanceof Error) {
      throw err;
    } else {
      console.error('Error[' + err.ErrorCode + '] -> "' + err.Message + '"');
    }
  };

  return Util;
});
