window.terafm = window.terafm || {};

(function(DOMEvents, initHandler, ui, help, editableManager) {

	var node;

	initHandler.onInit(function() {
		addEventListeners();
	});


	function addEventListeners() {
		makeThing();

		node.addEventListener('click', e => e.preventDefault() )
		node.addEventListener('mousedown', function(e) {
			e.preventDefault();
			e.stopPropagation();

			terafm.contextMenuController.setContext(terafm.focusedEditable, {x: parseFloat(node.style.left)+15, y: parseFloat(node.style.top)+15})
			terafm.contextMenuController.open();
		})

		// On editable focus
		DOMEvents.registerHandler('focus', function(e) {
			var editable = e.path[0],
				rect = editable.getBoundingClientRect();

			if(editableManager.isEditableText(editable)) {
				terafm.focusedEditable = editable

				var rect = terafm.editableManager.getRect(editable)

				node.style.top = rect.y + 3 + 'px';
				node.style.left = rect.x + rect.width - 22 + 'px';
				
				node.style.display = 'block';
			}
		});

		DOMEvents.registerHandler('blur', function() {
			node.style.display = 'none'
		});

	}

	function makeThing() {
		if(!node) {
			ui.inject({
				html: `<a id="popupTrigger" class="terafm-quickAccessTrigger" href="#"></a>`,
				returnNode: '#popupTrigger'
			}, function(res) {
				node = res;
			})
		}
	}

})(terafm.DOMEvents, terafm.initHandler, terafm.ui, terafm.helpers, terafm.editableManager);