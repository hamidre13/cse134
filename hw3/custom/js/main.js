//Arrays that hold the tag links and content
var tabLinks = new Array();
var contentDivs = new Array();

function init() {
	//Get the links and content from the page, put them in their arrays
	var tabListItems = document.getElementById('tabs').childNodes;

	for (i = 0; i < tabListItems.length; i++) {
		//make sure that this child node is a list item <li>
		if (tabListItems[i].nodeName == "LI") {
			//get this list item's child link element <a> 
			var tabLink = getFirstChildWithTagName(tabListItems[i], 'A');

			//get the link's destination (removes the hash symbol)
			var id = getHash(tabLink.getAttribute('href'));

			//place 
			tabLinks[id] = tabLink;
			contentDivs[id] = document.getElementById(id);
		}
	}

	//assign onclick events to the tab links, and highlight the first tab
	var i = 0;

	for (var id in tabLinks) {
		//assign showTab function to the onclick event for each tab
		tabLinks[id].onclick = showTab;

		//remove the resulting blue box around the tab when the link is clicked
		tabLinks[id].onfocus = function() { this.blur() };

		//highlight first tab
		if (i == 0) {
			tabLinks[id].className = 'selected';
		}

		i++;
	}

	//Hide all content divs except the first
	var i = 0;

	for (var id in contentDivs) {
		if (i != 0) {
			contentDivs[id].className = 'tabContent hide';
		}

		i++;
	}
}

/* This is called whenever a certain tab is clicked.
 * 'this' represents the link attached to the tab 
 */
function showTab() {
	//get the id of the tab that was clicked
	var selectedId = getHash(this.getAttribute('href'));

	// Highlight the selected tab, and dim all others.
	// Also show the content in the selected div, and hide all others
	for (var id in contentDivs) { //loop through all tabs
		//if the id of this tab matches the clicked one, then...
		if (id == selectedId) {
			//set its class to 'selected'
			tabLinks[id].className = 'selected';

			//set the content div's class to tabContent
			contentDivs[id].className = 'tabContent';
		//if it wasn't the clicked tab...
		} else {
			//remove the 'selected' styling from this tab if it was there
			tabLinks[id].className = '';

			//hide the old selected tab's content
			contentDivs[id].className = 'tabContent hide'
		}
	}

	//stop the browser following the link
	return false;
}

//pretty self-explanatory method
function getFirstChildWithTagName(element, tagName) {
	//loop through all children
	for (var i = 0; i < element.childNodes.length; i++) {
		//if name of this child matches one we are looking for, return it
		if (element.childNodes[i].nodeName == tagName) {
			return element.childNodes[i];
		}
	}
}


function getHash(url) {
	var hashPos = url.lastIndexOf('#');
	//chop off everything up to and including the #
	return url.substring(hashPos + 1);
}