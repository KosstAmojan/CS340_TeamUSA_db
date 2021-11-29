function filterParks() {
    //get the id of the selected homeworld from the filter dropdown
    var parks_id = document.getElementById('parks_filter').value
    //construct the URL and redirect to it
    window.location = '/parks/filter/' + parseInt(parks_id)
}
