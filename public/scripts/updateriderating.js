function updateRideRating(id){
    $.ajax({
        url: '/ridesrating/' + id,
        type: 'PUT',
        data: $('#update-riderating').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
