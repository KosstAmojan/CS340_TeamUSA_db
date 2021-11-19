function deleteRide(id){
    $.ajax({
        url: '/rides/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteGuestRides(pid, cid){
  $.ajax({
      url: '/guests/pid/' + pid + '/rides/' + cid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};
