function searchGuestsByLastName() {
    //get the name 
    var name_search_string  = document.getElementById('name_search_string').value
    //construct the URL and redirect to it
    window.location = '/guests/search/' + encodeURI(name_search_string)
}
