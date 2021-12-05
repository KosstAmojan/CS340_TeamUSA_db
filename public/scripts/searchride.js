function searchRidesByName() {
    //get the name 
    var name_search_string  = document.getElementById('name_search_string').value;
    //construct the URL and redirect to it
    window.location = '/rides/search/' + encodeURI(name_search_string);
};

function searchRidesByNameRR() {
    //get the name 
    var ride_search_string  = document.getElementById('ride_search_string').value;
    //construct the URL and redirect to it
    window.location = '/ridesrating/searchrides/' + encodeURI(ride_search_string);
};
