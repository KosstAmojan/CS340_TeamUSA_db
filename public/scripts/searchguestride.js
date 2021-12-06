function searchGuestRide() {
    //get the name 
    var name_search_string  = document.getElementById('name_search_string').value;
    //construct the URL and redirect to it
    if (name_search_string == '') {
        window.location = '/guestride';
    }
    else {
        window.location = '/guestride/search/' + encodeURI(name_search_string);
    }
};
