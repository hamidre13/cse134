//Arrays that hold the tag links and content
var tabLinks = new Array();
var contentDivs = new Array();

//global variable to hold data from Firebase
var db;

//global variable that holds search string
var searchStr

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

//on submit of search form
function fetchResults(txt) {
	console.log(searchStr);
}


/* document.ready() */
$(function() {
	//bind action of form to search page plus query string
	$("#searchBar").keypress(function(event) {
			$("#srch").attr("action", 
				"search.html?str=" + document.getElementById('searchBar').value + 	
					"&type=" + document.getElementById('searchType').value);
	});

	//bind an action to changing the search type
	$("#searchType").change(function(event) {
			$("#srch").attr("action", 
				"search.html?str=" + document.getElementById('searchBar').value + 	
					"&type=" + document.getElementById('searchType').value);
	});

	//add handlers to all links that lead to tag info pages
	var tagLinks = document.getElementsByClassName('tagLink');

	//holds name of tag, angled braces stripped off
	var tagName;

	//add href attribute to each tag link
	for (var i = 0; i < tagLinks.length; i++) {
		tagKey = tagLinks[i].getAttribute("data-name");

		tagLinks[i].href = "tag-page.html?tag=" + tagKey; 
	}

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

	/* Attach handler to login modal */
	$(".contactUs").click(function() {
		console.log("we here");
		$("#contactUs").slideDown();

		$("body > *").not(".modal").css("opacity", 0.5);
		//$("body *").css("background-color", "#fff");

		//disable everything else on the page
		$("body > *").not(".modal").prop('disabled', true);
	});

	//only execute if body id is tagBody
	if ($("body").attr("id") == "tagBody") {
		/* ------ Firebase Code - read out entire database --------
		   All view files have a script tag with firebase cdn ---*/
		var databaseRef = new Firebase("https://cse134.firebaseio.com/");

		//first param = event
		//second param = on success
		//third param = on permissions denial
		databaseRef.once("value", function(snapshot) {
			db = snapshot.val();
			console.log(db);
		//make sure we are on a tag page
			console.log("must be on tag page");

			//now load data from firebase

			//first, get tag name from query string
			tagTitle = $.url().param('tag');

			//fill in tag name
			document.getElementById("tagName").innerHTML = "&lt;" + db['tags'][tagTitle]['tagName'] + "&gt;";

			//fill in tag definition
			document.getElementById("def").innerHTML = db['tags'][tagTitle]['tagDefenition'];

			//fill in attributes and their descriptions
			//first get overall containers so don't need to
			//keep fetching them
			var attrList = document.getElementById('attrTabs');
			var container = document.getElementById("attributes");

			//only properties we inserted will be in db object, 
			//so don't need to filter them
			for (var key in db['tags'][tagTitle]['attrs']) {

				console.log(key.toString());

				//create a list item
				var attrItem = document.createElement('li');

				//create an anchor to be a child of the list item
				var attr = document.createElement('a');

				attr.href = "javascript:;"
				attr.setAttribute("data-name", "#" + key);
				attr.className = "attr";
				attr.innerHTML = key;

				//append the anchor tag to the list item
				attrItem.appendChild(attr);

				//append the list item to the list
				attrList.appendChild(attrItem);

				//create div to nest underneath element we just got
				var descHolder = document.createElement('div');

				//will need to change so display first tab, but not rest
				descHolder.className = "tabContent hide";
				descHolder.id = key;

				//create HTMLParagraphElement to nest under descHolder
				var desc = document.createElement('p');

				//string to access the attribute's description
				var str = "db['tags'][tagTitle]['attrs']." + key;

				console.log(str);

				desc.innerHTML = eval(str);

				descHolder.appendChild(desc);

				container.appendChild(descHolder);

				/* Bind handler for all compatible attributes */
				$(".attr").bind("click", function() {
					//remove all, add relevant one back
					$(".attr").removeClass("selected");
					$(this).addClass("selected");

					//hide all, uncover relevant one
					$("#attributes").children().addClass("hide");
					$($(this).attr("data-name")).removeClass("hide");
				});
			}

			//Browser compatibility
			//console.log("chrome info: " + document.getElementById("chrome").firstChild.innerHTML);
			document.getElementById("chrome").firstChild.innerHTML = db['tags'][tagTitle]['chrome'];
			document.getElementById("firefox").firstChild.innerHTML = db['tags'][tagTitle]['fireFox'];
			document.getElementById("safari").firstChild.innerHTML = db['tags'][tagTitle]['safari'];
			document.getElementById("internetExplorer").firstChild.innerHTML = db['tags'][tagTitle]['ie'];
			document.getElementById("opera").firstChild.innerHTML = db['tags'][tagTitle]['opera'];

			//Example - unrendered code
			//console.log(document.getElementById('exCode').firstChild);
			$("#exCode").children().first().text(db['tags'][tagTitle]['example']);
			//document.getElementById('exCode').firstChild.innerHTML = db['tags'][tagTitle]['example'];

			//Example - rendered code
			document.getElementById('exResult').innerHTML = db['tags'][tagTitle]['example'];

			//related tags
			for (var tag in db['tags'][tagTitle]['relatedTags']) {
				console.log("rel. tag name: " + db['tags'][tagTitle]['relatedTags'][tag]);
				//create an anchor tag
				var newTag = document.createElement('a');
				newTag.href = "tag-page.html?tag=" + db['tags'][tagTitle]['relatedTags'][tag];

				newTag.innerHTML = "&lt;" + db['tags'][tagTitle]['relatedTags'][tag] + "&gt;";

				document.getElementById('relTags').appendChild(newTag);

				//append a line break
				document.getElementById('relTags').appendChild(document.createElement('br'));
			}
		}, function(err) {
			console.log("Can't read due to error " + err);
		});
	}
});
