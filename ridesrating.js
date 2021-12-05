module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getRidesRating(res, mysql, context, complete){
        mysql.pool.query("SELECT RR.guestRideID, CONCAT(G.firstName,' ',G.lastName) as guestName, R.name as rideName, DATE_FORMAT(RR.rideDateTime, '%Y-%m-%dT%H:%i') as rideDateTime, RR.ratingvalue FROM RidesRating RR LEFT JOIN Guests G on RR.GuestID = G.GuestID LEFT JOIN Rides R on RR.rideID = R.rideID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ridesrating = results;
            complete();
        });
    }
    

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteriderating.js","filterriderating.js","searchriderating.js","change_page.js"];
        var mysql = req.app.get('mysql');
        getRidesRating(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('ridesrating', context);
            }

        }
    });

    router.get('/search', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteriderating.js","filterriderating.js","searchriderating.js","change_page.js"];
        var mysql = req.app.get('mysql');
        getRidesRating(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('ridesrating', context);
            }

        }
    });

    /* Do the add functionality first */
    router.get('/filter/:ridesrating', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteriderating.js","filterriderating.js","searchriderating.js","change_page.js"];
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

    router.post('/', function(req, res){
        console.log(req.body.ridesrating)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO ridesRating (parkID, name, maxOccupancy, dateBuilt, lengthSeconds, speedMPH, hasLoop, heightRestrictionFeet) VALUES (?,?,?,?,?,?,?,?)";
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

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Rides WHERE rideID = ?";
        var removes = [req.params.id];
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