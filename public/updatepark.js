function updatePark(id){
    $.ajax({
        url: '/parks/' + id,
        type: 'PUT',
        data: $('#update-park').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
