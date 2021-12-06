module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getGuestRides(res, mysql, context, complete){
        mysql.pool.query("SELECT GR.guestID, CONCAT(G.firstName,' ',G.lastName) as guestName, GR.rideID, R.name as rideName, CONCAT(GR.guestID,'-',GR.rideID) as guestrideID, CONCAT(GR.guestID,'%2D',GR.rideID) as guestrideIDurl from GuestRide GR INNER JOIN Guests G on GR.guestID = G.guestID INNER JOIN Rides R on GR.rideID = R.rideID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guestride = results;
            complete();
        });
    }

    function getGuests(res, mysql, context, complete){
        mysql.pool.query("SELECT guestID as id, CONCAT(firstName,' ',lastName) as name FROM Guests", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guests = results;
            complete();
        });
    }

    function getRides(res, mysql, context, complete){
        mysql.pool.query("SELECT rideID as id, name FROM Rides", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rides = results;
            complete();
        });
    }

    function getGuestsOrRidesWithNameLike(req, res, mysql, context, complete) {
        var query = "SELECT GR.guestID, CONCAT(G.firstName,' ',G.lastName) as guestName, GR.rideID, R.name as rideName, CONCAT(GR.guestID,'-',GR.rideID) as guestrideID "
                    + "from GuestRide GR INNER JOIN Guests G on GR.guestID = G.guestID INNER JOIN Rides R on GR.rideID = R.rideID WHERE R.name LIKE " 
                    + mysql.pool.escape('%' + req.params.s + '%') + " OR CONCAT(G.firstName,' ',G.lastName) LIKE" + mysql.pool.escape('%' + req.params.s + '%');
        //console.log(query)
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guestride = results;
            complete();
        });
    }

    function getGuestRide(res, mysql, context,id, complete){
        sql = "SELECT GR.guestID, CONCAT(G.firstName,' ',G.lastName) as guestName, GR.rideID, R.name as "
                        + "rideName, CONCAT(GR.guestID,'-',GR.rideID) as guestrideID, CONCAT(GR.guestID,'%2D',GR.rideID) as guestrideIDurl from GuestRide GR INNER JOIN Guests "
                        + "G on GR.guestID = G.guestID INNER JOIN Rides R on GR.rideID = R.rideID where "
                        + "CONCAT(GR.guestID,'-',GR.rideID) = ?"
        var inserts = [id]
        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.guestride = results;
            complete();
        });
    }

     
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["change_page.js","deleteguestride.js","searchguestride.js","selectedguestride.js","updateguestride.js"];
        var printerr = req.query.valid;
        if (printerr != null){
            context.duperr = ["Duplicate entry. Please choose a different combination."];
        }
        var mysql = req.app.get('mysql');
        getGuestRides(res, mysql, context, complete);
        getGuests(res, mysql, context, complete);
        getRides(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('guestride', context);
            }

        }
    });

    router.get('/-1', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["change_page.js","deleteguestride.js","searchguestride.js","selectedguestride.js","updateguestride.js"];
        context.duperr = ["Duplicate entry. Please choose a different combination."];
        var mysql = req.app.get('mysql');
        getGuestRides(res, mysql, context, complete);
        getGuests(res, mysql, context, complete);
        getRides(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('guestride', context);
            }

        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var checks = [req.body.guestID, req.body.rideID];
        results = []
        // I have to validate this combination doesn't exist in the table currently somehow
        var checksql = "SELECT guestID, rideID FROM GuestRide where guestID = ? AND rideID = ?";
        checksql = mysql.pool.query(checksql, checks, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
        // If the combination does not exist, go ahead and do the insert, otherwise print an alert message. 
        if (typeof results[0] == "undefined") {
            var sql = "INSERT INTO GuestRide (guestID, rideID) VALUES (?,?)";
            sql = mysql.pool.query(sql,checks,function(error, results, fields){
                if(error){
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                    res.end();
                }
                res.redirect('/guestride');
            })
        }else{
            res.redirect("/guestride/-1");
        }        
     });
    });

    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["change_page.js","deleteguestride.js","searchguestride.js","selectedguestride.js","updateguestride.js"];
        var mysql = req.app.get('mysql');
        getGuestsOrRidesWithNameLike(req, res, mysql, context, complete);
        getGuests(res, mysql, context, complete);
        getRides(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                //console.log(context);
                res.render('guestride', context);
            }
        }
    });

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["change_page.js","deleteguestride.js","searchguestride.js","selectedguestride.js","selectedguest.js","selectedride.js","updateguestride.js"];
        var mysql = req.app.get('mysql');
        context.duperr = ["Duplicate entry. Please choose a different combination."];
        getGuestRide(res, mysql, context, req.params.id, complete);
        getGuests(res, mysql, context, complete);
        getRides(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                console.log(context);
                res.render('update-guestride', context);
            }
        }
    });

    router.get('/-1/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["change_page.js","deleteguestride.js","searchguestride.js","selectedguestride.js","selectedguest.js","selectedride.js","updateguestride.js"];
        var mysql = req.app.get('mysql');
        getGuestRide(res, mysql, context, req.params.id, complete);
        getGuests(res, mysql, context, complete);
        getRides(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                console.log(context);
                res.render('update-guestride', context);
            }

        }
    });

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var checks = [req.body.guestID, req.body.rideID];
        results = []
        // I have to validate this combination doesn't exist in the table currently somehow
        var checksql = "SELECT guestID, rideID FROM GuestRide where guestID = ? AND rideID = ?";
        checksql = mysql.pool.query(checksql, checks, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
        // If the combination does not exist, go ahead and do the insert, otherwise print an alert message. 
        if (typeof results[0] == "undefined") {
            var sql = "UPDATE GuestRide SET guestID=?, rideID=? WHERE CONCAT(guestID,'-',rideID)=?";
            console.log(req.params);
            var inserts = [req.body.guestID, req.body.rideID, decodeURIComponent(req.params.id)];
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
    }else{
        res.redirect("/guestride/-1/:id");
    }});
});

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM GuestRide where CONCAT(guestID,'-',rideID) = ?";
        var removes = [decodeURIComponent(req.params.id)];
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