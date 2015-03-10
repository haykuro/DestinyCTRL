require(['common/utils', 'DestinyCTRL'], function(Util, DestinyCTRL) {
  if(window.hasOwnProperty('chrome')) {
    chrome.browserAction.onClicked.addListener(function() {
      var index = chrome.extension.getURL('index.html');
      var query = function(tabs) {
        try {
          if(tabs.length) {
            chrome.tabs.update(tabs[0].id, {
              active : true
            });
          } else {
            chrome.tabs.create({
              url : index
            });
          }
        } catch(err)  {
          Util.handleError(err);
        }
      };

      try {
        chrome.tabs.query({ url : index }, query);
      } catch (err) {
        Util.handleError(err);
      }
    });
  } else {
    throw new Error('Browser not supported');
  }

  DestinyCTRL.initialize();
});
