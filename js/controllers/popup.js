(function(blacklist) {

	let hostnamePlaceholder = document.querySelector('.js-hostname'),
		blacklistToggleBtn = document.querySelector('.head-toggle'),
		hostname;

	document.addEventListener('click', function(e) {
		e.preventDefault();

		let target = e.target;

		// Open recovery link
		if(target.classList.contains('open-recovery-link')) {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {action: 'openRecoveryDialog'});
			});

		// Open options link
		} else if(target.classList.contains('open-options-link')) {
			chrome.runtime.openOptionsPage();

		// Delete all link
		} else if(target.classList.contains('delete-all-link')) {
			if(target.classList.contains('confirm-click')) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {action: 'clearData'});

					target.innerHTML = 'Data has been deleted';
					target.classList.remove('confirm-click');
					target.classList.add('green');
					target.classList.remove('delete-all-link'); // Disable this action on link
				});
			} else {
				target.classList.add('confirm-click');
				target.innerHTML = 'Click again to confirm deletion of all data on ' + hostname + '. Deletion cannot be undone.';
			}

		}
	})




	// Get hostname for current tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		let url = new URL(tabs[0].url);

		hostname = url.hostname;

		hostnamePlaceholder.innerHTML = hostname;

		blacklist.isBlocked(hostname, function(bool) {
			if(bool) {
				blacklistToggleBtn.classList.remove('is-enabled');
			}
		})
	});



	// Toggle blacklist button
	blacklistToggleBtn.addEventListener('mousedown', function(e) {
		
		// Remove from blacklist
		if(blacklistToggleBtn.classList.contains('is-enabled')) {
			blacklist.block(hostname);

		// Add to blacklist
		} else {
			blacklist.unblock(hostname);

		}

		blacklistToggleBtn.classList.toggle('is-enabled');
	});
})(terafm.blacklist);