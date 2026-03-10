(function() {

	// Disable splash!
	// return;


	// Changing this number will make splash screen appear after update installation
	const SPLASH_VERSION = 1;

	chrome.runtime.onInstalled.addListener(function(details) {
		if(details.reason === 'update') {
			chrome.storage.sync.get('splashVersion', obj => {
				if(!obj.hasOwnProperty('splashVersion') || obj.splashVersion !== SPLASH_VERSION) {
					const url = chrome.runtime.getURL('html/splash.html');
					chrome.tabs.create({
						url: url
					})
					chrome.storage.sync.set({ splashVersion: SPLASH_VERSION });
				}
			});
		}
	})
	
})();
