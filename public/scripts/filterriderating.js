function filterRidesRating() {
    //get the id of the selected homeworld from the filter dropdown
    var ridesrating_id = document.getElementById('ridesrating_filter').value
    //construct the URL and redirect to it
    window.location = '/ridesrating/filter/' + parseInt(ridesrating_id)
}
