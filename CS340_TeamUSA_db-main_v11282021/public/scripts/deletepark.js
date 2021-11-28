function deletePark(id){
    $.ajax({
        url: '/parks/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
