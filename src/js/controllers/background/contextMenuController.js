(function() {
	const CONTEXT_MENU_DEFINITIONS = [
		{
			id: 'recoverEditable',
			title: 'Recover this field',
			contexts: ['editable'],
		},
		{
			id: 'openRecoveryDialog',
			title: 'Open form recovery',
			contexts: ['all'],
		},
	];

	/**
	 * Rebuild context menus so they remain available after service worker restarts.
	 */
	function ensureContextMenus() {
		chrome.storage.sync.get('hideContextItems', function(obj) {
			if(obj.hideContextItems === true) {
				chrome.contextMenus.removeAll();
				return;
			}

			chrome.contextMenus.removeAll(function() {
				for(const menuDefinition of CONTEXT_MENU_DEFINITIONS) {
					chrome.contextMenus.create(menuDefinition);
				}
			});
		});
	}

	chrome.runtime.onInstalled.addListener(function() {
		ensureContextMenus();
	});

	chrome.runtime.onStartup.addListener(function() {
		ensureContextMenus();
	});

	chrome.storage.onChanged.addListener(function(changes, namespace) {
		if(namespace !== 'sync' || !changes.hideContextItems) {
			return;
		}

		ensureContextMenus();
	});

	chrome.contextMenus.onClicked.addListener(function(data) {
		if(data.menuItemId === 'recoverEditable') {
			chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
				if(!tabs.length) {
					return;
				}

				chrome.tabs.sendMessage(tabs[0].id, {action: 'openQuickAccess'});
			});
		} else if(data.menuItemId === 'openRecoveryDialog') {
			chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
				if(!tabs.length) {
					return;
				}

				chrome.tabs.sendMessage(tabs[0].id, {action: 'openRecoveryDialog'});
			});
		}
	});
})();
