module.exports = function () {
    var express = require('express');
    var router = express.Router();


    function getParks(res, mysql, context, complete) {
        mysql.pool.query("SELECT parkID, name, maxOccupancy, DATE_FORMAT(dateBuilt, '%m/%d/%Y') as dateBuilt FROM Parks", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.parks = results;
            complete();
        });
    }

    /* Find parks whose name starts with a given string in the req */
    function getParksWithNameLike(req, res, mysql, context, complete) {
        if (req.params.s == "") {
            var query = "SELECT parkID, name, maxOccupancy, DATE_FORMAT(dateBuilt, '%m/%d/%Y') as dateBuilt FROM Parks";
        }
        else {
            var query = "SELECT parkID, name, maxOccupancy, DATE_FORMAT(dateBuilt, '%m/%d/%Y') as dateBuilt FROM Parks where name LIKE " + mysql.pool.escape('%' + req.params.s + '%');
        }
        console.log(query);
        console.log(req.params.s);

        mysql.pool.query(query, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.parks = results;
            complete();
        });
    }

    function getPark(req, res, mysql, context, complete) {
        var sql = "SELECT parkID, name, maxOccupancy, DATE_FORMAT(dateBuilt, '%m/%d/%Y') as dateBuilt FROM Parks WHERE parkID = ?";
        var inserts = [req.params.parks];
        if (isNaN(inserts)) {
            var sql = "SELECT parkID, name, maxOccupancy, DATE_FORMAT(dateBuilt, '%m/%d/%Y') as dateBuilt FROM Parks";
        }
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.parks = results;
            complete();
        });

    }

    function getParkName(res, mysql, context, id, complete) {
        var sql = "SELECT parkID, name, maxOccupancy, DATE_FORMAT(dateBuilt, '%Y-%m-%d') as dateBuilt FROM Parks WHERE parkID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.parks = results[0];
            complete();
        });
    }
    /*Display all parks. Requires web based javascript to delete parks with AJAX*/

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletepark.js", "filterpark.js", "searchpark.js", "change_page.js"];
        var mysql = req.app.get('mysql');
        getParks(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('parks', context);
            }

        }
    });

    router.get('/search', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletepark.js", "filterpark.js", "searchpark.js", "change_page.js"];
        var mysql = req.app.get('mysql');
        getParks(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('parks', context);
            }

        }
    });

    // Display all parks filtered
    router.get('/filter/:parks', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletepark.js", "filterpark.js", "searchpark.js", "updatepark.js", "change_page.js"];
        var mysql = req.app.get('mysql');
        getPark(req, res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('parks', context);
            }

        }

    });

    /* Display all parks whose name starts with a given string. Requires web based javascript to delete parks with AJAX */
    router.get('/search/:s', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletepark.js","filterpark.js", "searchpark.js", "updatepark.js", "change_page.js"/*, "selectedpark.js"*/];
        var mysql = req.app.get('mysql');
        getParksWithNameLike(req, res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('parks', context);
            }
        }
    });

    /* Display one park for the specific purpose of updating the park */

    router.get('/:id', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterpark.js", "updatepark.js", "change_page.js"];
        var mysql = req.app.get('mysql');
        console.log(req.params);
        getParkName(res, mysql, context, req.params.id, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('update-park', context);
            }

        }
    });

    /* Adds a park, redirects to the park page after adding */

    router.post('/', function (req, res) {
        console.log(req.body.parks)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Parks (name, maxOccupancy, dateBuilt) VALUES (?,?,?)";
        var inserts = [req.body.name, req.body.maxOccupancy, req.body.dateBuilt];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/parks');
            }
        });
    });



    /* The URI that update data is sent to in order to update a park */

    router.put('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Parks SET name=?, maxOccupancy=?, dateBuilt=? WHERE parkID=?";
        var inserts = [req.body.name, req.body.maxOccupancy, req.body.dateBuilt, req.params.id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a park, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Parks WHERE parkID = ?";
        var removes = [req.params.id];
        sql = mysql.pool.query(sql, removes, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            } else {
                res.status(202).end();
            }
        })
    })

    return router;
}();