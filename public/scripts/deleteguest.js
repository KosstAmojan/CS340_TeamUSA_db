function deleteGuest(id){
    $.ajax({
        url: '/guests/' + id,
        type: 'DELETE',
        success: function(result){
            if(result.responseText != undefined){
              alert(result.responseText)
            }
            else {
              alert("Possible FK constraint in GuestRide if does not remove")
              window.location.reload(true)
            } 
        }
    })
};
