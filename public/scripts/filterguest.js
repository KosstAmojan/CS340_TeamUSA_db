function filterGuests() {
    //get the id of the selected homeworld from the filter dropdown
    var guests_id = document.getElementById('guests_filter').value
    //construct the URL and redirect to it
    window.location = '/guests/filter/' + parseInt(guests_id)
}
