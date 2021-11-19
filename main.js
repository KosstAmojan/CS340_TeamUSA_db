var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
PORT        = 33402;

var app = express();
var handlebars = require('express-handlebars').create({
        defaultLayout:'main',
        });

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('mysql', mysql);
app.use('/parks', require('./parks.js'));
app.use('/rides', require('./rides.js'));
app.use('/guests', require('./guests.js'));
app.use('/ridesrating', require('./ridesrating.js'));
app.use('/guestrides', require('./guestrides.js'));
app.use('/', express.static('public'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(PORT, function(){
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});