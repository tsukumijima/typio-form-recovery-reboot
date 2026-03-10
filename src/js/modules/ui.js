const ui = {};

let rootNode,
	shadowRootNode,
	innerShadowRootNode,

	iconFontInjected = false;

// Some sites override the entire DOM sometimes, this will check if the rootNode
// exists in the real DOM and append it if not
ui.touch = function() {
	if(shadowRootNode) {
		var node = document.getElementById('terafm-shadow');

		if(!node) {
			document.body.appendChild(rootNode);

		} else if(node && !node.shadowRoot) {
			document.body.removeChild(node);
			document.body.appendChild(rootNode);
		}
	}
}


// Accepts dataObj.html or dataObj.path to template
ui.inject = function(dataObj, replaceObj, callback) {

	// Make sure shadow root has been created
	if(!shadowRootNode) {
		createShadowRoot();
	}

	if(dataObj.loadIcons) {
		loadIconFont();
	}

	// Make replace arg optional
	if(!callback) {
		callback = replaceObj;
		replaceObj = undefined;
	}

	// If template was passed, fetch template content
	if(dataObj.path) {

		// Complete path will full extenison url
		dataObj.path = chrome.runtime.getURL(dataObj.path);

		var request = fetch(dataObj.path).then(response => response.text());

		request.then(function(text) {
			if(replaceObj) text = replacePlaceholders(text, replaceObj);
			let retnode = addToShadowRoot(text, dataObj.returnNode);
			callback(retnode);
		});

	// Html was passed, insert
	} else if(dataObj.html) {
		if(replaceObj) dataObj.html = replacePlaceholders(dataObj.html, replaceObj);
		let retnode = addToShadowRoot(dataObj.html, dataObj.returnNode);
		callback(retnode);
	}

}

ui.getShadowRootNode = function() {
	return shadowRootNode || false;
}

function replacePlaceholders(htmlStr, replObj) {
	Object.keys(replObj).map((key) => {
		htmlStr = htmlStr.replace(key, replObj[key]);
	})
	return htmlStr;
}

function addToShadowRoot(html, returnNode) {
	innerShadowRootNode.insertAdjacentHTML('beforeend', html);

	if(returnNode) {
		return innerShadowRootNode.querySelector(returnNode);
	}
}

function createShadowRoot() {
	document.body.insertAdjacentHTML('beforeend', '<div id="terafm-shadow"></div>');

	rootNode = document.getElementById('terafm-shadow');
	shadowRootNode = rootNode.attachShadow({mode: 'open'});

	let html = '';
	html += '<style>@import "' + chrome.runtime.getURL('css/content.css') + '";</style>';
	html += '<div id="shadow-root"></div>';

	shadowRootNode.innerHTML = html;
	innerShadowRootNode = shadowRootNode.getElementById('shadow-root');
}

function loadIconFont() {
	if(iconFontInjected) return;

	let html = '<style>@import "' + chrome.runtime.getURL('fonts/typio/styles.css') + '";</style>';
	innerShadowRootNode.insertAdjacentHTML('afterbegin', html);

	var iconfont = new FontFace("typio", 'url('+ chrome.runtime.getURL('fonts/typio/fonts/typio.woff') +')');
	document.fonts.add(iconfont);

	iconFontInjected = true;
}

export default ui;
