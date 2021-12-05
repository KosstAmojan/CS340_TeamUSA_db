function searchParksByName() {
    //get the name 
    var park_name_search_string  = document.getElementById('park_name_search_string').value;
    //construct the URL and redirect to it
    window.location = '/parks/search/' + encodeURI(park_name_search_string);
    console.log(window.location);
}
