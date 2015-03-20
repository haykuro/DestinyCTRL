define([
  'common/utils'
], function(_) {
  function API() {}

  API.key = null;
  API.base = 'https://www.bungie.net/Platform';

  API.requestWithToken = function() {
    var self = this;
    var args = [].slice.call(arguments);

    return new Promise(function(resolve, reject) {
      _.getCookie('bungled').then(function(csrfToken) {
        var _deleteCSRF = function() {
          delete self._csrf;
        };

        self._csrf = csrfToken;

        API.request.apply(self, args)
          .then(resolve)
          .then(_deleteCSRF)
          .catch(reject);
      }).catch(reject);
    });
  };

  API.request = function(method, endpoint, params, payload) {
    var self = this;

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.onload = function() {
        var raw = this.response;
        var resp = JSON.parse(raw);

        if (this.status >= 200 && this.status < 400) {
          if(resp.ErrorCode > 1) {
            reject(resp);
          }
          else {
            resolve(resp.Response);
          }
        } else {
          reject(resp);
        }
      };

      xhr.onerror = function() {
        var raw = this.response;
        var resp = JSON.parse(raw);

        reject(resp);
      };

      var url = [
        API.base.replace(/(\/$)/, ''),
        endpoint.replace(/(^\/|\/$)/, '')
      ].join('/') + '/' + API.objectToQueryString(params || {});

      xhr.open(method, url, true);

      if(self._csrf) {
        xhr.withCredentials = true;

        xhr.setRequestHeader('X-CSRF', self._csrf);
      }

      xhr.setRequestHeader('X-API-Key', API.key);

      xhr.send(payload);
    });
  };

  API.objectToQueryString = function(obj) {
    var params = [];

    for(var key in obj) {
      params.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }

    return params ? '?' + params.join('&') : '';
  };

  return API;
});
