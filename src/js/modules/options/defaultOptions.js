const defaultOptions = {};

var def = {}
const platform = typeof navigator !== 'undefined' && typeof navigator.platform === 'string'
	? navigator.platform.toLowerCase()
	: '';

def.savePasswords = false;
def.saveCreditCards = false;
def.storageTimeDays = 30;
def.saveIndicator = 'disable';
def.saveIndicatorColor = '#3CB720';
def.hideSmallEntries = true;
def.keybindEnabled = true;
def.quickAccessButtonEnabled = true;
def.quickAccessButtonTrigger = 'focus';
def.cloneOnRestore = false;
def.resetEditablesBetweenRestorations = false;
def.qaGroupSessions = true;
def.qaEnableSessionSubmenu = true;
def.hideContextItems = false;

// Mac specific
if(platform.indexOf('mac') !== -1) {
	def.keybindToggleRecDiag = 'Control + Backspace';
	def.keybindRestorePreviousSession = 'Control + Alt + Backspace';
	def.keybindOpenQuickAccess = 'Control + r';

// Windows and everything else
} else {
	def.keybindToggleRecDiag = 'Alt + Backspace';
	def.keybindRestorePreviousSession = 'Shift + Alt + Backspace';
	def.keybindOpenQuickAccess = 'Alt + r';
}




defaultOptions.get = function(opt) {
	return opt in def ? def[opt] : undefined
}

defaultOptions.getAll = function() {
	return JSON.parse(JSON.stringify(def))
}


export default defaultOptions;
