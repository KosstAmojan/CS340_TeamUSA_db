function updateGuestRide(id){
    $.ajax({
        url: '/guestride/' + id,
        type: 'PUT',
        data: $('#update-guestride').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
