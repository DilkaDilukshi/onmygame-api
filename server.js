// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var mysql = require('mysql');
require('newrelic');

// TODO: remove all of this stuff from a public repo
var connection = mysql.createConnection({
	host:"aa1035vuvzyhfst.cexydpoxrxls.us-east-1.rds.amazonaws.com",
	user:"root",
	password:"150kroad",
	database:"omg"
});

connection.connect();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 80; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// more routes for our API will happen here
// ROUTES FOR OUR API
// =============================================================================

// <-- route middleware and first route are here

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------
router.route('/settings/me')

	// create a bear (accessed at POST http://localhost:8080/api/bears)
	.post(function(req, res) {
		res.json({ message: 'Settings created!' });
 	})

	.get(function(req, res) {
		res.json({message: "Settings returned"});
	});

router.route('/data/:user_id')

	.post(function(req, res){
		//console.log(req);
   		console.log(req.body.type+":"+req.body.value);
		connection.query('INSERT into points (userId, type, value) VALUES (?,?,?)',[req.params.user_id, req.body.type, req.body.value], function(err, rows, fields) {
    		if (err) throw err;
    		res.json();
		});
//		res.json({message: queryString});
	})

	.get(function(req, res) {
		var queryString = 'SELECT * from users where id='+req.params.user_id;

		connection.query(queryString, function(err, rows, fields) {
    		if (err) throw err;
    		res.json(rows);
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);