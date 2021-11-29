function updateRide(id){
    $.ajax({
        url: '/rides/' + id,
        type: 'PUT',
        data: $('#update-ride').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
