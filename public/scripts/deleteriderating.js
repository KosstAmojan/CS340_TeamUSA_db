function deleteRideRating(id){
    $.ajax({
        url: '/ridesrating/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
