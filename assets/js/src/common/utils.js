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
            reject(Util.createError('Cookie does not exist'));
          }
        }.bind(this));
      }
      else {
        reject(Util.createError('Browser is not supported'));
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

  Util.createError = function(msg, code) {
    return {
      ErrorCode : msg.ErrorCode || code || -1,
      Message : msg.Message || msg
    };
  };

  return Util;
});
