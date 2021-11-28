function updateGuest(id){
    $.ajax({
        url: '/guests/' + id,
        type: 'PUT',
        data: $('#update-guest').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
