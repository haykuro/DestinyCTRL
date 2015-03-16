/**
 * Asset and logitics manager for Bungie's Destiny
 *
 * Copyright (c) 2015 DestinyCTRL
 *
 * Seth Benjamin <animecyc@gmail.com>
 * Arissa Brown <flipmodes01@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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
