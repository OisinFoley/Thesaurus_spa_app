// Using const based on the runtime benefits mentioned in this answer:
// https://stackoverflow.com/questions/21237105/const-in-javascript-when-to-use-it-and-is-it-necessary
const express    = require('express');
const app 	   = express();
var port       = process.env.PORT || 8080;

//returns coloured error codes in the console
const morgan     = require('morgan');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser'); //parses body into JSON
const router 	   = express.Router();
const appRoutes  = require('./app/routes/api')(router,app);
//built in module
const path 	   = require('path');

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended:true })); //for parsing application/x-www-form-urlencoded


app.use(express.static(__dirname + '/public'));

//redirect all routes beginning with /api to the module associated with "appRoutes"
app.use('/api', appRoutes);


//cloud vendor string
 // mongoose.connect('mongodb://oisinfoley:p1nec0ne@ds127894.mlab.com:27894/oisinfoleymongo', function(err){
 // mongoose.connect('mongodb://oisinfoley:p1nec0ne@ds127894.mlab.com:27894/oisinfoleymongo?connectTimeoutMS=300000+socketTimeoutMS=300000', function(err){
 	
mongoose.connect('mongodb://localhost:27017/', function(err){
	if(err){
		console.log("NOT connected to the db: " + err);
	} else {
		console.log("successfully connected to db");
	}
});

//All routes entered into the browser, will redirect to this base view
app.get('*',function(req,res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html' ));
})

app.listen(port, function(){
	console.log('running our server and the port is :  ' + port);
});

module.exports = app; // for testing
