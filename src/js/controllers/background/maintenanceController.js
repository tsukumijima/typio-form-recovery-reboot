import defaultOptions from '../../modules/options/defaultOptions';

const MAINTENANCE_ALARM = 'typio-db-maintenance';
const MAINTENANCE_INTERVAL_MINUTES = 60;
const MAINTENANCE_MINIMUM_INTERVAL_MS = 43200000;

/**
 * Create the alarm whenever the service worker boots so maintenance keeps running.
 */
function ensureMaintenanceAlarm() {
	chrome.alarms.get(MAINTENANCE_ALARM, function(alarm) {
		if(alarm) {
			return;
		}

		chrome.alarms.create(MAINTENANCE_ALARM, {
			delayInMinutes: 1,
			periodInMinutes: MAINTENANCE_INTERVAL_MINUTES,
		});
	});
}

function maybeRunMaintenance() {
	chrome.storage.local.get('DBMaintenanceTimestamp', function(res) {
		let lastRun = res.DBMaintenanceTimestamp || 0;

		if(Date.now() - lastRun <= MAINTENANCE_MINIMUM_INTERVAL_MS) {
			console.log('Maintenance skipped. It already ran recently.');
			return;
		}

		chrome.idle.queryState(60, function(state) {
			if(state === 'idle' || state === 'locked') {
				console.log('Idle state detected. Running maintenance.');
				runMaintenance(function() {
					chrome.storage.local.set({ DBMaintenanceTimestamp: Date.now() });
				});
			} else {
				console.log('Maintenance postponed because browser is active.');
			}
		});
	});
}

chrome.runtime.onInstalled.addListener(function() {
	ensureMaintenanceAlarm();
});

chrome.runtime.onStartup.addListener(function() {
	ensureMaintenanceAlarm();
});

chrome.alarms.onAlarm.addListener(function(alarm) {
	if(alarm.name === MAINTENANCE_ALARM) {
		maybeRunMaintenance();
	}
});

ensureMaintenanceAlarm();

function runMaintenance(callback) {
	chrome.storage.sync.get('storageTimeDays', function(data) {
		let maxdays = data.hasOwnProperty('storageTimeDays') ? data['storageTimeDays'] : defaultOptions.get('storageTimeDays');
		let expirepoint = (Date.now() / 1000) - (maxdays * 86400);

		// Delete old stuff
		chrome.storage.local.get(null, function(data) {
			// Loop through all domains in storage
			for(let domain in data) {
				if(domain.indexOf('###') !== 0 || !data[domain].hasOwnProperty('fields')) {
					continue;
				}

				let action = 'ignore';

				// If empty domain (nothing stored in domain)
				if(Object.keys(data[domain].fields).length < 1) {
					action = 'delete';
				} else {
					for(let fieldId in data[domain].fields) {
						// Loop through every session id per field
						for(let sessionId in data[domain].fields[fieldId].sess) {
							if(sessionId < expirepoint) {
								// Delete entry
								delete data[domain].fields[fieldId].sess[sessionId];

								// Delete entire field if empty
								if(Object.keys(data[domain].fields[fieldId].sess).length < 1) {
									delete data[domain].fields[fieldId];
								}

								action = 'save';

								// Delete entire domain if empty
								if(Object.keys(data[domain].fields).length < 1) {
									action = 'delete';
								}
							}
						}
					}
				}

				// Write changes
				if(action === 'save') {
					console.log('Maintenance updated domain data.', domain);
					chrome.storage.local.set({ [domain]: data[domain] });
				} else if(action === 'delete') {
					console.log('Maintenance removed empty domain data.', domain);
					chrome.storage.local.remove(domain);
				}
			}

			if(callback) {
				callback();
			}
		});
	});
}
