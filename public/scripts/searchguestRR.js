function searchGuestsByLastNameRR() {
    //get the name 
    var name_search_string  = document.getElementById('name_search_string').value
    //construct the URL and redirect to it
    if (name_search_string == '') {
        window.location = '/ridesrating';
    }
    else {
        window.location = '/ridesrating/searchguests/' + encodeURI(name_search_string);
    }
    
};
