var flickrBaseUrl = "http://api.flickr.com/services/rest?",
	flickrNVP = {
		method : "flickr.photos.search",
		format : "json",
		api_key : "your_api_key_goes_here",
		page : "1"
	},
	flickrQuery,
	searchField = $id("search"),
	searchButton = $id("go"),
	resultsDiv = $id("results"),
	prevButton = $id("prev"),
	nextButton = $id("next");
	
function $id(id) {
	return document.getElementById(id);
}
	
function constructQuery(){
	var query = flickrBaseUrl;
	for (x in flickrNVP){
		query += x;
		query += "=";
		query += flickrNVP[x];
		query += "&";
	}
	return (query);
}
	
function replaceWithData(template, data) {
	var html_template = template, 
		prop;
	for (prop in data) {
		if (data.hasOwnProperty(prop)) {
			html_template = html_template.replace('{{' + prop + '}}', data[prop]);
			html_template = html_template.replace('{{' + prop + '}}', data[prop]);
		}
	}
	return html_template;
}

function createScriptWrapper(){
	if (typeof($id("flickrJSON")) != 'undefined' && $id("flickrJSON") != null){
		$id("flickrJSON").parentNode.removeChild($id("flickrJSON"));
	}
	var script = document.createElement('script');
	script.setAttribute('id', 'flickrJSON')
	script.src = flickrQuery;

	document.getElementsByTagName('body')[0].appendChild(script);
}

// Once the Flickr JSON loads into it's wrapper, it auto-fires this function.
function jsonFlickrApi(response){
	var thisFlickr = "";
	flickrNVP.page = "1";
	for (var i = 0; i < response.photos.photo.length; i++){
		thisFlickr += replaceWithData($id("flickrTemplate").innerHTML, response.photos.photo[i]);
	}
	resultsDiv.innerHTML = thisFlickr;
	togglePagination();
}

// This function simply disables/enables previous and next buttons depedning on what page we're on
// e.g. if we're on page 1 we can't go back again, if we're on the last page we can't go forward.
function togglePagination(){
	if (flickrNVP.page > 1){
		prevButton.removeAttribute("disabled");
	} else {
		prevButton.setAttribute("disabled");
	}
	if (flickrNVP.page >= response.photos.pages){
		nextButton.setAttribute("disabled");
		flickrNVP.page = response.photos.pages;
	} else {
		nextButton.removeAttribute("disabled");
	}
}

// Controls
searchButton.onclick=function(){
	flickrNVP.text = encodeURIComponent(searchField.value);
	flickrQuery = constructQuery();
	createScriptWrapper()
};
prevButton.onclick=function(){
	if (flickrNVP.page){
		flickrNVP.page--;
	}
	flickrQuery = constructQuery();
	createScriptWrapper()
}
nextButton.onclick=function(){
	if (flickrNVP.page){
		flickrNVP.page++;
	}
	flickrQuery = constructQuery();
	createScriptWrapper()
}