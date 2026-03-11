const blacklist = {};

blacklist.getAll = function(callback) {
	getOptionData(callback)
}

blacklist.blockDomain = function(domain, callback) {
	getOptionData(function(list) {
		if(isBlocked(list, domain) === false) {
			list.push(domain);
			saveList(list);
			if(callback) callback(list);
		}
	});
}

blacklist.unblock = function(url, callback) {
	getOptionData(function(list) {
		let index = isBlocked(list, url);
		if(index !== false) {
			list.splice(index, 1);
			saveList(list, callback);
		}
	});
}

blacklist.isBlocked = function(url, callback) {
	getOptionData(function(list) {
		callback(isBlocked(list, url) !== false );
	});
}

function isBlocked(list, url) {

	let index = list.indexOf(url);
	if(index !== -1) return index;

	try {
		// Full URL was passed
		let urlObj = new URL(url);

		// Check if hostname is blocked
		let index = list.indexOf(urlObj.hostname);
		if(index !== -1) return index;


		// Loop through items and compare individually
		for(let pi in list) {
			let pattern = list[pi];

			// Regex
			let regex = isRegex(pattern);
			if(regex !== false) {
				if(regex.test(url)) {
					return pi;
				}

				// Wildcard
			} else if(pattern.indexOf('*') !== -1) {
				let wild = wildcardCheck(pattern, urlObj.hostname);
				if(wild) return pi;
			}
		}

		// Domain was passed instead of URL
	} catch(e) {

		let domain = url;

		let index = list.indexOf(domain);
		if(index !== -1) return index;

		for(let pi in list) {
			// Wildcard
			if(list[pi].indexOf('*') !== -1) {
				let wild = wildcardCheck(list[pi], domain);
				if(wild) return pi;
			}
		}
	}


	function wildcardCheck(pattern, hostname) {
		try {
			let regex = new RegExp('^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
			if(regex.test(hostname)) {
				return true;
			}
		} catch(e){}
	}


	return false;
}

function isRegex(string) {
	if(string.length > 3 && string.indexOf('/') === 0 && string.slice(-1) === '/') {
		let tmp = string.substring(1, string.length-1);
		try {
			return new RegExp(tmp);
		} catch(e) {}
	}
	return false;
}

function saveList(list, callback) {
	chrome.storage.sync.set({'domainBlacklist': list}, function(set) {
		if(callback) callback(list);
	});
}


function getOptionData(callback) {
	chrome.storage.sync.get('domainBlacklist', function(data) {
		data = convertLegacy(data['domainBlacklist']);
		callback(data);
	})
}


// Old blacklist was saved as a big text field with one domain per line
// If the old format is still used, this function converts the data
// into array format.
function convertLegacy(blob) {

	// Empty array or string or null
	if(!blob) {
		return [];

		// If string, convert to array
	} else if(typeof blob === 'string') {
		blob = (blob + "").split(/[\r|\n]+/g).filter(word => word.trim().length > 0);
		return blob;

		// Already array
	} else {
		return blob;
	}
}

export default blacklist;