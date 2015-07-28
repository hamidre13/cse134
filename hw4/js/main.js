//Arrays that hold the tag links and content
var tabLinks = new Array();
var contentDivs = new Array();

//global variable to hold data from Firebase
var db;

function init() {
	//Get the links and content from the page, put them in their arrays

	
	var tabListItems = document.getElementById('tabs').childNodes;

	for (var i = 0; i < tabListItems.length; i++) {
		//make sure that this child node is a list item <li>
		if (tabListItems[i].nodeName == "LI") {
			//get this list item's child link element <a> 
			var tabLink = getFirstChildWithTagName(tabListItems[i], 'A');

			//get the link's destination (removes the hash symbol)
			var id = getHash(tabLink.getAttribute('href'));
            console.log(id);
			//place 
			tabLinks[id] = tabLink;
			contentDivs[id] = document.getElementById(id);
		}
	}

	//assign onclick events to the tab links, and highlight the first tab
	var i = 0;
	console.log(tabLinks);

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


/* document.ready() */
$(function() {
	//add handlers to all links that lead to tag info pages
	var tagLinks = document.getElementsByClassName('tagLink');

	//holds name of tag, angled braces stripped off
	var tagName;

	//add href attribute to each tag link
	for (var i = 0; i < tagLinks.length; i++) {
		tagKey = tagLinks[i].getAttribute("data-name");

		tagLinks[i].href = "tag-page.html?tag=" + tagKey; 
	}

	/* Compatible Attributes tabs */
	$(".attr").click(function() {
		//remove all, add relevant one back
		$(".attr").removeClass("selected");
		$(this).addClass("selected");

		//hide all, uncover relevant one
		$("#attributes").children().addClass("hide");
		$($(this).attr("name")).removeClass("hide");
	});

	//for all pages
	//no modals should be seen when document first loads
	$("#loginModal").hide();
	$("#forgotPasswd").hide();
	$("#createAccount").hide();

	/* Attach handler to login modal */
	$(".login").click(function() {
		console.log("we here");
		$("#loginModal").slideDown();

		$("body > *").not(".modal").css("opacity", 0.5);
		//$("body *").css("background-color", "#fff");

		//disable everything else on the page
		$("body > *").not(".modal").prop('disabled', true);
	});

	$(".forgot").click(function() {
		//get rid of login modal
		$(".modal:visible").slideUp();

		//slide in forgot password modal
		$("#forgotPasswd").slideDown();
	});

	$(".createAcc").click(function() {
		$(".modal:visible").slideUp();

		//slide in create account modal
		$("#createAccount").slideDown();
	});

	$(".exit").click(function() {
		$(this).parent().parent().slideUp();

		$("body *").css("opacity", 1);

		//re-enable everything else on the page
		$("body > *").not(".modal").prop('disabled', false);

	});

	$(".backToLogin").click(function() {
		//get rid of login modal
		$(".modal:visible").slideUp();

		//slide in forgot password modal
		$("#loginModal").slideDown();
	});

	/* ------ Firebase Code - read out entire database --------
	   All view files have a script tag with firebase cdn ---*/
	var databaseRef = new Firebase("https://cse134.firebaseio.com/");

	//first param = event
	//second param = on success
	//third param = on permissions denial
	databaseRef.on("value", function(snapshot) {
		console.log("loading in db no matter where you entered site");
		db = snapshot.val();
		console.log(db);
	}, function(err) {
		console.log("Can't read due to error " + err);
	});


	//only execute if we are on a tag page, and if db exists
	if ($("#purl").length) {
		console.log("must be on tag page");

		//now load data from firebase

		//first, get tag name from query string
		tagTitle = $.url().param('tag');
	}

	console.log(db);
});
