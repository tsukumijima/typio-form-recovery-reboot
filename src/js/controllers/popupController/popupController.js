import '../../../sass/popup.scss';
import blacklist from '../../modules/blacklist'

let hostnamePlaceholder = document.querySelector('.js-hostname'),
	blacklistToggleBtn = document.querySelector('.head-toggle'),
	urlObj;

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

	// Show key combos
	} else if(target.classList.contains('open-keyboard-shortcuts')) {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {action: 'showKeyboardShortcuts'});
		});

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
			target.innerHTML = 'Click again to confirm deletion of all data on ' + urlObj.hostname + '. Deletion cannot be undone.';
		}

	// } else if(target.classList.contains('donate-link')) {
	// 	window.open('https://www.buymeacoffee.com/typio');

	} else if(target.classList.contains('feedback-link')) {
		chrome.runtime.sendMessage({ action: 'openSettings', hash: '#/feedback' });

	} else if(target.classList.contains('faq-link')) {
		chrome.runtime.sendMessage({ action: 'openSettings', hash: '#/faq' });
	}
})




// Get hostname for current tab
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	urlObj = new URL(tabs[0].url);

	hostnamePlaceholder.innerHTML = urlObj.hostname;

	blacklist.isBlocked(urlObj.href, function(bool) {
		if(bool) {
			blacklistToggleBtn.classList.remove('is-enabled');
		}
	})
});



// Toggle blacklist button
blacklistToggleBtn.addEventListener('mousedown', function(e) {

	// Add to blacklist
	if(blacklistToggleBtn.classList.contains('is-enabled')) {
		blacklist.blockDomain(urlObj.hostname);

	// Remove from blacklist
	} else {
		blacklist.unblock(urlObj.href);

	}

	blacklistToggleBtn.classList.toggle('is-enabled');
});
