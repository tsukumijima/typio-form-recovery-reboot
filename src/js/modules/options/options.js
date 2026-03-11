import optionSanitizer from './optionSanitizer';
import defaultOptions from './defaultOptions';

const options = {};
var hasLoadedFromStorage;

// Default values, can be overwritten and saved in chrome
var globalOptions = optionSanitizer.sanitize(defaultOptions.getAll())

options.set = function(opt, val) {
	console.log('Writing to storage.sync');

	if(!globalOptions.hasOwnProperty(opt)) {
		console.error(opt, ' was not saved because the option does not exist')
		return;
	}

	chrome.storage.sync.set({ [opt] : val });
	globalOptions[opt] = val
}

options.setMany = function(options) {
	console.log('Writing to storage.sync');

	const keys = Object.keys(options);
	for(const key of keys) {
		if(!globalOptions.hasOwnProperty(key)) {
			console.error(key, ' was not saved because the option does not exist')
			delete options[key];
		}
	}

	chrome.storage.sync.set(options);
	globalOptions = { ...globalOptions, ...options };
}

options.get = function(opt) {
	if(!hasLoadedFromStorage) return false;
	return globalOptions[opt];
}

options.getAll = function() {
	if(!hasLoadedFromStorage) return false;
	return globalOptions;
}

options.loadFromChromeStorage = function(callback) {

	// Override default options
	chrome.storage.sync.get(null, function(options) {
		if(options) {
			for(var opt in options) {

				// Sanitize stored value
				var san = optionSanitizer.sanitize(opt, options[opt]);

				// If sanitazion passes, override default value
				if(san !== undefined) {
					globalOptions[opt] = san;
				}
			}
		}

		// console.log(globalOptions)

		hasLoadedFromStorage = true;
		if(callback) callback();
	});

}

export default options;