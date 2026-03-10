// Controllers
import './listenerController.js';
import './maintenanceController.js';
import './contextMenuController.js';
import './splashController.js';


chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({version: 3});
});
// chrome.storage.local.clear();

// chrome.tabs.create({
//     url: 'chrome-extension://lpbjhmjpobgjcacflfibadcfimmbpmal/html/app.html#/database-manager',
// })
