module.exports = function(){
    var express = require('express');
    var router = express.Router();
  
    function getParks(res, mysql, context, complete){
        mysql.pool.query("SELECT parkID as id, name FROM Parks", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.parks  = results;
            complete();
        });
    }
  
    function getGuests(res, mysql, context, complete){
        mysql.pool.query("SELECT age, firstName, guestID, heightFeet, heightInches, lastName, park.name as name from Guests INNER JOIN Parks on Guests.parkID = Parks.parkID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guests = results;
            complete();
        });
    }
  
    /* Find guests whose name starts with a given string in the req */
    function getGuestsWithNameLike(req, res, mysql, context, complete) {
        var query = "SELECT age, firstName, guestID, heightFeet, heightInches, lastName, park.name as name from Guests INNER JOIN Parks on Guests.parkID = Parks.parkID WHERE lastName LIKE " + mysql.pool.escape(req.params.s + '%');
        console.log(query)
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guests = results;
            complete();
        });
    }
  
    function getGuest(req, res, mysql, context, complete){
        var sql = "SELECT age, firstName, guestID, heightFeet, heightInches, lastName, park.name as name from Guests INNER JOIN Parks on Guests.parkID = Parks.parkID WHERE guestID = ?";
        var inserts = [req.params.guests];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guests = results;
            complete();
        });
    }
  
    function getGuestName(res, mysql, context, id, complete){
      var sql = "SELECT age, firstName, guestID, heightFeet, heightInches, lastName, park.name as name from Guests INNER JOIN Parks on Guests.parkID = Parks.parkID WHERE guestID = ?";
      var inserts = [id];
      mysql.pool.query(sql, inserts, function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.guests = results[0];
          complete();
      });
  }
    /*Display all guests. Requires web based javascript to delete guests with AJAX*/
  
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteguest.js","filterguest.js","searchguest.js","selectedpark.js","change_page.js"];
        var mysql = req.app.get('mysql');
        getGuests(res, mysql, context, complete);
        getParks(res, mysql, context, complete)
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('guests', context);
            }
  
        }
    });
  
    // Display all guests filtered
    router.get('/filter/:guests', function(req, res){
      var callbackCount = 0;
      var context = {};
      context.jsscripts = ["deleteguest.js","filterguest.js","searchguest.js","updateguest.js","selectedpark.js","change_page.js"];
      var mysql = req.app.get('mysql');
      getGuest(req, res, mysql, context, complete);
      getParks(res, mysql, context, complete);
      function complete(){
          callbackCount++;
          if(callbackCount >= 1){
              res.render('guests',context);
          }
  
      }
  
  });
  
    /*Display all guests whose name starts with a given string. Requires web based javascript to delete guests with AJAX */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteguest.js","filterguest.js","searchguest.js","updateguest.js","change_page.js"];
        var mysql = req.app.get('mysql');
        getGuestsWithNameLike(req, res, mysql, context, complete);
        getParks(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('guests', context);
            }
        }
    });
  
    /* Display one guest for the specific purpose of updating the guest */
  
    router.get('/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterguest.js","updateguest.js","selectedpark.js","change_page.js"];
        var mysql = req.app.get('mysql');
        getGuestName(res, mysql, context, req.params.id, complete);
        getParks(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-guest', context);
            }
  
        }
    });
  
    /* Adds a guest, redirects to the guest page after adding */
  
    router.post('/', function(req, res){
        console.log(req.body.guests)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Guests (age, firstName, heightFeet, heightInches, lastName, parkID) VALUES (?,?,?,?,?,?)";
        var inserts = [req.body.age, req.body.firstName, req.body.heightFeet, req.body.heightInches, req.body.lastName, req.body.parkID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/guests');
            }
        });
    });
  
  
  
    /* The URI that update data is sent to in order to update a guest */
  
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Guests SET age=?, firstName=?, heightFeet=?, heightInches=?, lastName=?, parkID=? WHERE guestID=?";
        var inserts = [req.body.age, req.body.firstName, req.body.heightFeet, req.body.heightInches, req.body.lastName, req.body.parkId, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });
  
    /* Route to delete a guest, simply returns a 202 upon success. Ajax will handle this. */
  
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Guests WHERE guestID = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })
  
    return router;
  }();