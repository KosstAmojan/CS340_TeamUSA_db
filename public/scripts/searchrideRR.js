function searchRidesByNameRR() {
    //get the name 
    var ride_search_string  = document.getElementById('ride_search_string').value;
    //construct the URL and redirect to it
    if (ride_search_string == '') {
        window.location = '/ridesrating';
    }
    else {
        window.location = '/ridesrating/searchrides/' + encodeURI(ride_search_string);
    }
};
