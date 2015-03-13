(function() {
  'use strict';

  chrome.browserAction.onClicked.addListener(function() {
    var index = chrome.extension.getURL('app/index.html');

    try {
      chrome.tabs.query({ url : index }, function(tabs) {
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
          console.error(err);
        }
      });
    } catch (err) {
      console.error(err);
    }
  });
}());
