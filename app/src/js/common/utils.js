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

  Util.inheritClass = function (subClass, superClass, extraProto) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or' +
        ' a function, not ' + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value : subClass,
        enumerable : false,
        writable : true,
        configurable : true
      }
    });

    if(extraProto) {
      for(var key in extraProto) {
        subClass.prototype[key] = extraProto[key];
      }
    }

    if (superClass) {
      subClass.__proto__ = superClass;
    };
  }

  Util.extend = function(target, source) {
    for(var key in source) {
      target[key] = source[key];
    }
  };

  Util.throttle = function(func, wait) {
    var last = 0;
    var timer;

    return function() {
      var now = new Date();
      var exec = function() {
        last = now;

        func.apply(this, arguments);
      }.bind(this);

      if(timer) {
        clearTimeout(timer);
        timer = null;
      }

      if((now - last) > wait) {
        exec();
      } else {
        timer = setTimeout(function() {
          exec();
        }, wait);
      }
    };
  };

  return Util;
});
