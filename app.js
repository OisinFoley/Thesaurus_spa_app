var express    = require('express');
// var cors = require('cors')
var app 	   = express();
var port       = process.env.PORT || 8080;

//returns coloured error codes in the console
var morgan     = require('morgan');
var mongoose   = require('mongoose');

//should declare this in our API file
var uuid = require('node-uuid');

var bodyParser = require('body-parser'); //parses body into JSON
var router 	   = express.Router();
var appRoutes  = require('./app/routes/api')(router,app,uuid);
//built in module
var path 	   = require('path');

//once core functionality setup, incorporate facebook login
//var passport   = require('passport');
//var social 	   = require('./app/passport/passport')(app, passport); //passing express functionality through app

app.use(morgan('dev'));

app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({ extended:true })); //for parsing application/x-www-form-urlencoded


app.use(express.static(__dirname + '/public'));

//redirect all routes beginning with /api to the module associated with "appRoutes"
app.use('/api', appRoutes);


//make AWS string instead
mongoose.connect('mongodb://oisinfoley:p1nec0ne@ds127894.mlab.com:27894/oisinfoleymongo', function(err){	

//mongoose.connect('mongodb://localhost:27017/', function(err){	
	if(err){
		console.log("NOT connected to the db: " + err);
	} else {
		console.log("successfully connected to db");
	}
});

//All routes entered into the browser, will redirect to this base view
app.get('*',function(req,res){
	res.sendFile(path.join(__dirname + '/public/app/views/home.html' ));
})

// server.listen(port, function(){	
// 	console.log('running our server and the port is :  ' + port);
// });
app.listen(port, function(){	
	console.log('running our server and the port is :  ' + port);
});




