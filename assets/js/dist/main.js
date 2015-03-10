!function(){var t,e,n;!function(r){function i(t,e){return b.call(t,e)}function o(t,e){var n,r,i,o,s,c,u,a,f,h,p,l=e&&e.split("/"),m=w.map,d=m&&m["*"]||{};if(t&&"."===t.charAt(0))if(e){for(t=t.split("/"),s=t.length-1,w.nodeIdCompat&&E.test(t[s])&&(t[s]=t[s].replace(E,"")),t=l.slice(0,l.length-1).concat(t),f=0;f<t.length;f+=1)if(p=t[f],"."===p)t.splice(f,1),f-=1;else if(".."===p){if(1===f&&(".."===t[2]||".."===t[0]))break;f>0&&(t.splice(f-1,2),f-=2)}t=t.join("/")}else 0===t.indexOf("./")&&(t=t.substring(2));if((l||d)&&m){for(n=t.split("/"),f=n.length;f>0;f-=1){if(r=n.slice(0,f).join("/"),l)for(h=l.length;h>0;h-=1)if(i=m[l.slice(0,h).join("/")],i&&(i=i[r])){o=i,c=f;break}if(o)break;!u&&d&&d[r]&&(u=d[r],a=f)}!o&&u&&(o=u,c=a),o&&(n.splice(0,c,o),t=n.join("/"))}return t}function s(t,e){return function(){var n=k.call(arguments,0);return"string"!=typeof n[0]&&1===n.length&&n.push(null),l.apply(r,n.concat([t,e]))}}function c(t){return function(e){return o(e,t)}}function u(t){return function(e){y[t]=e}}function a(t){if(i(g,t)){var e=g[t];delete g[t],v[t]=!0,p.apply(r,e)}if(!i(y,t)&&!i(v,t))throw new Error("No "+t);return y[t]}function f(t){var e,n=t?t.indexOf("!"):-1;return n>-1&&(e=t.substring(0,n),t=t.substring(n+1,t.length)),[e,t]}function h(t){return function(){return w&&w.config&&w.config[t]||{}}}var p,l,m,d,y={},g={},w={},v={},b=Object.prototype.hasOwnProperty,k=[].slice,E=/\.js$/;m=function(t,e){var n,r=f(t),i=r[0];return t=r[1],i&&(i=o(i,e),n=a(i)),i?t=n&&n.normalize?n.normalize(t,c(e)):o(t,e):(t=o(t,e),r=f(t),i=r[0],t=r[1],i&&(n=a(i))),{f:i?i+"!"+t:t,n:t,pr:i,p:n}},d={require:function(t){return s(t)},exports:function(t){var e=y[t];return"undefined"!=typeof e?e:y[t]={}},module:function(t){return{id:t,uri:"",exports:y[t],config:h(t)}}},p=function(t,e,n,o){var c,f,h,p,l,w,b=[],k=typeof n;if(o=o||t,"undefined"===k||"function"===k){for(e=!e.length&&n.length?["require","exports","module"]:e,l=0;l<e.length;l+=1)if(p=m(e[l],o),f=p.f,"require"===f)b[l]=d.require(t);else if("exports"===f)b[l]=d.exports(t),w=!0;else if("module"===f)c=b[l]=d.module(t);else if(i(y,f)||i(g,f)||i(v,f))b[l]=a(f);else{if(!p.p)throw new Error(t+" missing "+f);p.p.load(p.n,s(o,!0),u(f),{}),b[l]=y[f]}h=n?n.apply(y[t],b):void 0,t&&(c&&c.exports!==r&&c.exports!==y[t]?y[t]=c.exports:h===r&&w||(y[t]=h))}else t&&(y[t]=n)},t=e=l=function(t,e,n,i,o){if("string"==typeof t)return d[t]?d[t](e):a(m(t,e).f);if(!t.splice){if(w=t,w.deps&&l(w.deps,w.callback),!e)return;e.splice?(t=e,e=n,n=null):t=r}return e=e||function(){},"function"==typeof n&&(n=i,i=o),i?p(r,t,e,n):setTimeout(function(){p(r,t,e,n)},4),l},l.config=function(t){return l(t)},t._defined=y,n=function(t,e,n){if("string"!=typeof t)throw new Error("See almond README: incorrect module build, no module name");e.splice||(n=e,e=[]),i(y,t)||i(g,t)||(g[t]=[t,e,n])},n.amd={jQuery:!0}}(),n("vendor/almond",function(){}),n("common/utils",[],function(){function t(){}return t.getCookie=function(t){return new Promise(function(e,n){window.hasOwnProperty("chrome")&&chrome.hasOwnProperty("cookies")?chrome.cookies.get({name:t,url:"https://www.bungie.net"},function(t){t?e(t.value):n()}.bind(this)):n()}.bind(this))},t.logError=function(t){if(t instanceof Error)throw t;console.error("Error["+t.ErrorCode+'] -> "'+t.Message+'"')},t}),n("common/api",["common/utils"],function(t){function e(){}return e.key=null,e.base="https://www.bungie.net/Platform",e.requestWithToken=function(){var n=this,r=[].slice.call(arguments);return new Promise(function(i,o){t.getCookie("bungled").then(function(t){var s=function(){delete n._csrf};n._csrf=t,e.request.apply(n,r).then(i)["catch"](o).then(s)})})},e.request=function(t,n,r,i){var o=this;return new Promise(function(s,c){var u=new XMLHttpRequest;u.onload=function(){var t=this.response,e=JSON.parse(t);this.status>=200&&this.status<400?e.ErrorCode>1?c(e):s(e.Response):c(e)},u.onerror=function(){var t=this.response,e=JSON.parse(t);c(e)};var a=[e.base.replace(/(\/$)/,""),n.replace(/(^\/|\/$)/,"")].join("/")+"/"+e.objectToQueryString(r||{});u.open(t,a,!0),o._csrf&&(u.withCredentials=!0,u.setRequestHeader("X-CSRF",o._csrf)),u.setRequestHeader("X-API-Key",e.key),u.send(i)})},e.objectToQueryString=function(t){var e=[];for(var n in t)e.push(encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e?"?"+e.join("&"):""},e}),n("models/character",["common/api"],function(t){function e(t,e){this._account=t,this.id=e.characterId}return e.prototype.getGear=function(){var e=this;return new Promise(function(n,r){t.request("GET","/Destiny/"+e._account.type+"/Account/"+e._account.id+"/Character/"+e.id,{definitions:!0}).then(n)["catch"](r)})},e.prototype.getInventory=function(){},e}),n("models/item",["models/bucket"],function(){function t(t,e){return{name:e.statName,value:t.value,description:e.statDescription,icon:"https://www.bungie.net/"+e.icon.replace(/^\//,"")}}function e(e,n){this.id=n.itemHash,this.name=n.itemName,this.type=n.itemType,this.typeName=n.itemType,this.description=n.itemDescription,this.icon="https://www.bungie.net/"+n.icon.replace(/^\//,""),this.stats={},this.primaryStatId=null,this.talentGrid=e.talentGrids[n.talentGridHash],this.tier={type:n.tierType,name:n.tierName};for(var r in n.baseStats){var i=n.baseStats[r],o=e.stats[i.statHash];this.stats[o.statIdentifier]=t(i,o)}var s=n.primaryBaseStat,c=e.stats[s.statHash];this.primaryStatId=c.statIdentifier,this.stats[this.primaryStatId]=t(s,c)}return e}),n("models/bucket",["models/item"],function(t){function e(e,n){var r=e.buckets[n.bucketHash];this.name=r.bucketName,this.order=r.bucketOrder,this.description=r.bucketDescription,this.items=[];for(var i in n.items){var o=n.items[i],s=e.items[o.itemHash];this.items.push(new t(e,s))}}return e}),n("models/vault",["models/bucket"],function(t){function e(e,n){for(var r in n.buckets)new t(e,n.buckets[r])}return e}),n("models/account",["common/api","models/character","models/vault"],function(t,e,n){function r(t){var n=this;this.id=t.userInfo.membershipId,this.type=t.userInfo.membershipType,this.lastPlayed=t.lastPlayed,this.grimoire=t.grimoireScore,this.avatar="https://www.bungie.net/"+t.userInfo.iconPath.replace(/^\//,""),this.characters=t.characters.map(function(t){return new e(n,t)})}return r.prototype.isXBL=function(){return 1===this.type},r.prototype.isPSN=function(){return 2===this.type},r.prototype.getCharacters=function(){return this.characters},r.prototype.getVault=function(){var e=this;return new Promise(function(r,i){t.requestWithToken("GET","/Destiny/"+e.type+"/MyAccount/Vault",{definitions:!0}).then(function(t){var e=new n(t.definitions,t.data);r(e)})["catch"](i)})},r}),n("common/bungie",["common/utils","common/api","models/account"],function(t,e,n){function r(t,n){t&&(e.key=t),n&&(e.base=n),this._accounts=[],this._authed=!1}return r.prototype.authorize=function(){var t=this;return new Promise(function(r,i){e.requestWithToken("GET","/User/GetBungieNetUser").then(function(o){var s=-1;if(o.hasOwnProperty("gamerTag"))s=1;else{if(!o.hasOwnProperty("psnId"))throw new Error("Unknown user type.");s=2}e.requestWithToken("GET","/User/GetBungieAccount/"+o.user.membershipId+"/0").then(function(e){t._authed=!0;for(var i in e.destinyAccounts)t._accounts.push(new n(e.destinyAccounts[i]));r()})["catch"](i)})["catch"](i)})},r.prototype.getAccounts=function(){if(!this._authed)throw new Error("Not authenticated.");return this._accounts},new r}),n("DestinyCTRL",["common/bungie"],function(t){function e(){}return e.initialize=function(){t.authorize()["catch"](function(){alert("You're not logged in.")}).then(function(){var e=t.getAccounts();e[0].getVault().then(function(){})})},e}),e(["common/utils","DestinyCTRL"],function(t,e){if(!window.hasOwnProperty("chrome"))throw new Error("Browser not supported");chrome.browserAction.onClicked.addListener(function(){var e=chrome.extension.getURL("index.html"),n=function(n){try{n.length?chrome.tabs.update(n[0].id,{active:!0}):chrome.tabs.create({url:e})}catch(r){t.handleError(r)}};try{chrome.tabs.query({url:e},n)}catch(r){t.handleError(r)}}),e.initialize()}),n("main",function(){})}();
//# sourceMappingURL=main.js
//# sourceMappingURL=main.js.map