// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var request = require('request');
var cors = require('cors')


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});



router.get('/',function (req,res) {
   res.json({message:"Welcome to our api",
            endpoints:["option_chains?stock_name=[stock name]","look_up?name=[company name]"]});
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.route('/option_chains').get(function(req, res) {

    var stockName = req.param('stock_name');
    if(!stockName) {
        res.status(422).send('Missing stock_name parameter. Example ?stock_name=AAPL');
        return;
    }
    var financeApiString
        = "https://www.google.com/finance/option_chain?q=NASDAQ%3ANAME&ei=3pF2WKm5LsWtjAHSma7wBw&authuser=0&output=json"
                                                                                            .replace("NAME",stockName);
    console.log(financeApiString);
	request(financeApiString, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
                    var fixedJSONBody  = body.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
                    var jsonResult = JSON.parse(fixedJSONBody);
    			res.json(
    				{
    					data: jsonResult
    				}
    			);

			  }
			  else {
			      res.status(422).send("Invalid stock_name");
              }
		});


});

router.route('/look_up').get(function (req,res) {
    var name = req.param('name');
    if(!name) {
        res.status(422).send('Missing name parameter. Example ?name=Apple');
        return;
    }
    Stock.find({$or:[{'Name':{$regex : new RegExp(name,'i')}},{'Symbol':{$regex : new RegExp(name,'i')}}]},function(err,stocks) {
        var result = [];
        if(err) {
            console.log('error getting stocks: ' + err);
        }
        else {
            //console.log(JSON.stringify(stocks));
            console.log("size: " + stocks.length);
            for(var i in stocks) {
                result.push({
                    companyName: stocks[i].Name,
                    stockName: stocks[i].Symbol
                });
            }
        }
        res.json({data:result});
    }).limit(10);
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);


var mongoose   = require('mongoose');
// mongoose.connect('mongodb://localhost/stock_names', function (err,db) {
mongoose.connect('mongodb://jose_bigio:josebigio12345@ds031845.mlab.com:31845/heroku_bt3gw0lq', function (err,db) {
    if(err) {
        console.log('error connecting to db: ' + err);
    }
    else {
        console.log('connected to db: ' + db);
    }
});
var Stock = require('./app/models/stock');