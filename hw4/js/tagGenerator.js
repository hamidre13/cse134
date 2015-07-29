	/* ------ Firebase Code - read out entire database --------
	   All view files have a script tag with firebase cdn ---*/
	var databaseRef = new Firebase("https://cse134.firebaseio.com/");

	//first param = event
	//second param = on success
	//third param = on permissions denial
	databaseRef.on("value", function(snapshot) {
		db = snapshot.val();
		console.log(db);
		//make sure we are on a tag page
		if ($("#purl").length) {
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
				attr.name = "#" + key;
				attr.className = "attr";
				attr.innerHTML = key;

				//append the anchor tag to the list item
				attrItem.appendChild(attr);

				//append the list item to the list
				attrList.appendChild(attrItem);

				//create div to nest underneath element we just got
				var descHolder = document.createElement('div');

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
			}
		}
		else {
			alert("You shouldn't be running this script on this page!");
		}
	}, function(err) {
		console.log("Can't read due to error " + err);
	});