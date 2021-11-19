function searchParksBytName() {
    //get the name 
    var name_search_string  = document.getElementById('name_search_string').value
    //construct the URL and redirect to it
    window.location = '/parks/search/' + encodeURI(name_search_string)
}
