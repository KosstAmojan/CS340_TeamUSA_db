module.exports = function(){
  var express = require('express');
  var router = express.Router();


  function getParks(res, mysql, context, complete){
      mysql.pool.query("SELECT parkID, name FROM Parks", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.parks = results;
          complete();
      });
  }
  
  function getRides(res, mysql, context, complete){
      mysql.pool.query("SELECT rideID, Parks.parkID, Rides.name, Rides.maxOccupancy, Rides.dateBuilt, lengthSeconds, speedMPH, hasLoop, heightRestrictionFeet FROM Rides INNER JOIN Parks ON Rides.parkID = Parks.parkID", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.rides = results;
          complete();
      });
  }

  function getRidebyParks(req, res, mysql, context, complete){
    var query = "SELECT Rides.rideID, name Parks.parkID AS parkID FROM Parks INNER JOIN Parks ON parkID = Parks.parkID WHERE Rides.parkID = ?";
    console.log(req.params)
    var inserts = [req.params.homeworld]
    mysql.pool.query(query, inserts, function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.rides = results;
          complete();
      });
  }

  /* Find people whose fname starts with a given string in the req */
  function getRidesWithNameLike(req, res, mysql, context, complete) {
    //sanitize the input as well as include the % character
     var query = "SELECT Rides.rideID as rideID, name, maxOccupancy, dateBuilt, lengthSeconds, speedMPH, hasLoop, heightRestrictionFeet FROM Rides INNER JOIN Parks ON parkID = Parks.name WHERE Rides.name LIKE " + mysql.pool.escape(req.params.s + '%');
    console.log(query)

    mysql.pool.query(query, function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.rides = results;
          complete();
      });
  }

  function getRide(res, mysql, context, id, complete){
      var sql = "SELECT Rides.rideID as rideID, parkID, name, maxOccupancy, dateBuilt, lengthSeconds, speedMPH, hasLoop, heightRestrictionFeet FROM Rides WHERE rideID = ?";
      var inserts = [id];
      mysql.pool.query(sql, inserts, function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.rides = results[0];
          complete();
      });
  }

  /*Display all people. Requires web based javascript to delete users with AJAX*/

  router.get('/', function(req, res){
      var callbackCount = 0;
      var context = {};
      context.jsscripts = ["deleteride.js","filterride.js","searchride.js"];
      var mysql = req.app.get('mysql');
      getParks(res, mysql, context, complete);
      getRides(res, mysql, context, complete);
      function complete(){
          callbackCount++;
          if(callbackCount >= 2){
              res.render('rides', context);
          }

      }
  });

  /*Display all people from a given homeworld. Requires web based javascript to delete users with AJAX*/
  router.get('/filter/:parks', function(req, res){
      var callbackCount = 0;
      var context = {};
      context.jsscripts = ["deleteride.js","filterride.js","searchride.js"];
      var mysql = req.app.get('mysql');
      getRidebyParks(req,res, mysql, context, complete);
      getParks(res, mysql, context, complete);
      function complete(){
          callbackCount++;
          if(callbackCount >= 2){
              res.render('rides', context);
          }

      }
  });

  /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
  router.get('/search/:s', function(req, res){
      var callbackCount = 0;
      var context = {};
      context.jsscripts = ["deleteride.js","filterride.js","searchride.js"];
      var mysql = req.app.get('mysql');
      getRidesWithNameLike(req, res, mysql, context, complete);
      getParks(res, mysql, context, complete);
      function complete(){
          callbackCount++;
          if(callbackCount >= 2){
              res.render('rides', context);
          }
      }
  });

  /* Display one person for the specific purpose of updating people */

  router.get('/:id', function(req, res){
      callbackCount = 0;
      var context = {};
      context.jsscripts = ["selectedpark.js", "updateride.js"];
      var mysql = req.app.get('mysql');
      getRide(res, mysql, context, req.params.id, complete);
      getParks(res, mysql, context, complete);
      function complete(){
          callbackCount++;
          if(callbackCount >= 2){
              res.render('update-ride', context);
          }

      }
  });

  /* Adds a person, redirects to the people page after adding */

  router.post('/', function(req, res){
      console.log(req.body.parks)
      console.log(req.body)
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO Rides (parkID, name, maxOccupancy, dateBuilt, lengthSeconds, speedMPH, hasLoop, heightRestrictionFeet) VALUES (?,?,?,?,?,?,?,?)";
      var inserts = [req.body.parkID, req.body.name, req.body.maxOccupancy, req.body.dateBuilt, req.body.lengthSeconds, req.body.speedMPH, req.body.hasLoop, req.body.heightRestrictionFeet];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(JSON.stringify(error))
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.redirect('/rides');
          }
      });
  });

  /* The URI that update data is sent to in order to update a person */

  router.put('/:id', function(req, res){
      var mysql = req.app.get('mysql');
      console.log(req.body)
      console.log(req.params.id)
      var sql = "UPDATE Rides SET parkID=?, name=?, maxOccupancy=?, dateBuilt=?, lengthSeconds=?, speedMPH=?, hasLoop=?, heightRestrictionFeet=? WHERE rideID=?";
      var inserts = [req.body.parkID, req.body.name, req.body.maxOccupancy, req.body.dateBuilt, req.body.lengthSeconds, req.body.speedMPH, req.body.hasLoop, req.body.heightRestrictionFeet];
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

  /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

  router.delete('/:id', function(req, res){
      var mysql = req.app.get('mysql');
      var sql = "DELETE FROM Rides WHERE rideID = ?";
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