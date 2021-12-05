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
    
    function getGuests(res, mysql, context, complete){
        mysql.pool.query("SELECT guestID as id, CONCAT(firstName,' ',lastName) as name from Guests", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guests = results;
            complete();
        });
    }


    function getRides(res, mysql, context, complete){
        mysql.pool.query("SELECT rideID as id, name from Rides", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rides = results;
            complete();
        });
    }


    function getRideRating(res, mysql, context, id, complete){
        var sql = "SELECT RR.guestRideID, CONCAT(G.firstName,' ',G.lastName) as guestName, R.name as rideName, DATE_FORMAT(RR.rideDateTime, '%Y-%m-%dT%H:%i') as rideDateTime, "
                    + "RR.ratingvalue, CASE WHEN RR.ratingvalue=1 THEN 'selected' ELSE '' END AS VAL1, CASE WHEN RR.ratingvalue=2 THEN 'selected' ELSE '' END AS VAL2, "
                    + "CASE WHEN RR.ratingvalue=3 THEN 'selected' ELSE '' END AS VAL3, CASE WHEN RR.ratingvalue=4 THEN 'selected' ELSE '' END AS VAL4, "
                    + "CASE WHEN RR.ratingvalue=5 THEN 'selected' ELSE '' END AS VAL5 FROM RidesRating RR LEFT JOIN Guests G on RR.GuestID = G.GuestID "                    
                    + "LEFT JOIN Rides R on RR.rideID = R.rideID where RR.guestRideID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ridesrating = results[0];
            complete();
        });
    }

    function getGuestsWithNameLike(req, res, mysql, context, complete) {
        var query = "SELECT RR.guestRideID, CONCAT(G.firstName,' ',G.lastName) as guestName, R.name as rideName, DATE_FORMAT(RR.rideDateTime, '%Y-%m-%dT%H:%i') as rideDateTime, RR.ratingvalue FROM RidesRating RR LEFT JOIN Guests G on RR.GuestID = G.GuestID LEFT JOIN Rides R on RR.rideID = R.rideID where G.lastName LIKE " + mysql.pool.escape('%' + req.params.s + '%');
        console.log(query)
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rideratings = results;
            complete();
        });
    }

    function getRidesWithNameLike(req, res, mysql, context, complete) {
        var query = "SELECT RR.guestRideID, CONCAT(G.firstName,' ',G.lastName) as guestName, R.name as rideName, DATE_FORMAT(RR.rideDateTime, '%Y-%m-%dT%H:%i') as rideDateTime, RR.ratingvalue FROM RidesRating RR LEFT JOIN Guests G on RR.GuestID = G.GuestID LEFT JOIN Rides R on RR.rideID = R.rideID where R.name LIKE " + mysql.pool.escape('%' + req.params.s + '%');
        console.log(query)
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rideratings = results;
            complete();
        });
    }


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteriderating.js","filterriderating.js","searchriderating.js","searchride.js","searchguest.js","change_page.js","selectedguest.js","selectedride.js"];
        var mysql = req.app.get('mysql');
        getRidesRating(res, mysql, context, complete);
        getGuests(res, mysql, context, complete);
        getRides(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('ridesrating', context);
            }

        }
    });

    router.get('/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteriderating.js","filterriderating.js","searchriderating.js","change_page.js","selectedguest.js","selectedride.js"];
        var mysql = req.app.get('mysql');
        getRideRating(res, mysql, context, req.params.id, complete);
        getGuests(res, mysql, context, complete);
        getRides(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-riderating', context);
            }

        }
    });


    router.get('/search', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteriderating.js","filterriderating.js","searchriderating.js","change_page.js","selectedguest.js","selectedride.js"];
        var mysql = req.app.get('mysql');
        getRidesRating(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context.rideratings);
                res.render('ridesrating', context);
            }
        }
    });

    router.get('/searchguests/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteriderating.js","filterriderating.js","searchriderating.js","change_page.js","selectedguest.js","selectedride.js"];
        var mysql = req.app.get('mysql');
        getGuestsWithNameLike(req, res, mysql, context, complete);
        getGuests(res, mysql, context, complete);
        getRides(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                console.log(context.rideratings);
                res.render('ridesrating', context);
            }
        }
    });

    router.get('/searchrides/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteriderating.js","filterriderating.js","searchriderating.js","change_page.js","selectedguest.js","selectedride.js"];
        var mysql = req.app.get('mysql');
        getRidesWithNameLike(req, res, mysql, context, complete);
        getGuests(res, mysql, context, complete);
        getRides(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('ridesrating', context);
            }
        }
    });


    router.post('/', function(req, res){
        console.log(req.body.ridesrating)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO RidesRating (guestID, rideID, rideDateTime, ratingValue ) VALUES (?,?,?,?)";
        var inserts = [req.body.guestID, req.body.rideID, req.body.rideDateTime, req.body.ratingValue];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/ridesrating');
            }
        });
    });

    // router.put('/:id', function(req, res){
    //     var mysql = req.app.get('mysql');
    //     console.log(req.body)
    //     console.log(req.params.id)
    //     var sql = "UPDATE Rides SET parkID=?, name=?, maxOccupancy=?, dateBuilt=?, lengthSeconds=?, speedMPH=?, hasLoop=?, heightRestrictionFeet=? WHERE rideID=?";
    //     var inserts = [req.body.parkID, req.body.name, req.body.maxOccupancy, req.body.dateBuilt, req.body.lengthSeconds, req.body.speedMPH, req.body.hasLoop, req.body.heightRestrictionFeet];
    //     sql = mysql.pool.query(sql,inserts,function(error, results, fields){
    //         if(error){
    //             console.log(error)
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }else{
    //             res.status(200);
    //             res.end();
    //         }
    //     });
    // });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM RidesRating WHERE guestRideID = ?";
        var removes = [req.params.id];
        sql = mysql.pool.query(sql, removes, function(error, results, fields){
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