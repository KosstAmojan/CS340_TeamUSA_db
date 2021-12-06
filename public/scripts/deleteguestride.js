function deleteGuestRide(id){
    $.ajax({
        url: '/guestride/' + encodeURIComponent(id),
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
