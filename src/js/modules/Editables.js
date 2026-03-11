import PathResolver from '../modules/PathResolver';
import Cache from '../modules/Cache';
import Helpers from '../modules/Helpers';
import Editable from '../classes/Editable';


let editables = {};

const editableTypes = ['color', 'date', 'datetime-local', 'email', 'month', 'number', 'password', 'checkbox', 'radio', 'range', 'search', 'tel', 'text', 'time', 'url', 'week', 'contenteditable', 'textarea'];
const textEditableTypes = ['text', 'email', 'search', 'password', 'url', 'tel', 'number', 'contenteditable', 'textarea'];

let editableCache = new Map();

editables.get = (el) => getEditable(el);
editables.getTextEditable = (el) => getEditable(el, true);

editables.isEditableType = (type) => editableTypes.includes(type);
editables.isTextEditableType = (type) => textEditableTypes.includes(type);
editables.isContentEditableType = (type) => type === 'contenteditable';


function getEditable(el, onlyTextEditable=false) {
	// If path, resolve it
	if(typeof el === 'string') {
		el = Cache.cache(el, () => PathResolver(el));
	}

	// If within contenteditable, the el itself might not be editable, so find its parent.
	// "input" event usually does this for you, but other events (like keyup or change) doesn't
	if(!editables.isEditable(el) && editables.isElement(el)) {
		const parentEditable = el.closest('[contenteditable]');
		if(parentEditable && parentEditable !== el) {
			return getEditable(parentEditable, onlyTextEditable);
		}
		return;
	}

	// Element must have a parent node. Feedly breaks pathGenerator if this isn't here. I assume
	// it has to do with the element being removed from the DOM before it reaches pathGen, and
	// that breaks it.
	if(!el || !el.parentNode || !editables.isEditable(el)) {
		return;
	}

	if(el && editableCache.has(el)) {
		let ed = editableCache.get(el);
		return !onlyTextEditable || (onlyTextEditable && ed.isTextEditable()) ? ed : false;

	} else if(!onlyTextEditable && editables.isEditable(el) || onlyTextEditable && editables.isTextEditable(el)) {
		let ed = new Editable(el);
		let isReplacement = false;
	
		// If a cached el was replaced with an existing one with the same
		// path (as happens on twitter when composing new posts), delete the
		// existing cache reference and make sure to re-generate the editable session id.
		editableCache.forEach((cachedEd, el) => {
			if(cachedEd.el.ownerDocument.body.contains(cachedEd.el) === false) {
				console.log('deleting nonexisting node', cachedEd.el);
				editableCache.delete(el);
				isReplacement = true;
			}
		})
		
		if(isReplacement) {
			ed.generateOwnSessionId();
		}
		
		editableCache.set(el, ed);

		return ed;
	}

}


editables.generateId = (path) => {
	return 'field' + Helpers.hashStr(path);
}

editables.getType = (el) => {
	return el.type ? el.type : 'contenteditable'
}

editables.isEditable = (elem) => {
	if(!editables.isElement(elem)) return false;

	if(editables.isNode(elem, 'INPUT') && editables.isEditableType(elem.type)) {
		return true;

	} else if(editables.isNode(elem, 'TEXTAREA')) {
		return true;

	} else if(editables.isNode(elem, 'SELECT')) {
		return true;

	} else if(elem.contentEditable === 'true') {
		return true;
	}

	return false;
}
editables.isTextEditable = (elem) => {
	if(!editables.isElement(elem)) return false;

	if(editables.isNode(elem, 'INPUT') && editables.isTextEditableType(elem.type)) {
		return true;

	} else if(elem.contentEditable === 'true') {
		return true;

	} else if(editables.isNode(elem, 'TEXTAREA')) {
		return true;
	}

	return false;
}
editables.isContentEditable = (elem) => {
	return elem.isContentEditable;
}
editables.isBigTextEditable = (elem) => {
	return elem.isContentEditable || elem.type === 'textarea';
}

editables.isElement = (elem) => {
	if(elem && elem.ownerDocument && elem.ownerDocument.defaultView && elem.parentNode !== null) {
		if(elem instanceof elem.ownerDocument.defaultView.HTMLElement) {
			return true;
		}
	}
	return false;
}

editables.isNode = (elem, compare) => {
	return (elem.nodeName + '').toLowerCase() === compare.toLowerCase();
}



let logtmt;
editables.pauseLoggingForJustABit = () => {
	window.terafm.pauseLogging = true;

	clearTimeout(logtmt);
	logtmt = setTimeout(function() {
		window.terafm.pauseLogging = false;
	}, 5);
}

export default editables;