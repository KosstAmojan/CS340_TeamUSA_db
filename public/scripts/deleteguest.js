function deleteGuest(id){
    $.ajax({
        url: '/guests/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
