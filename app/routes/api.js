const User  		   = require('../models/user');
const Word  		   = require('../models/word');
const Synonym  	   = require('../models/synonym');

const uuid 		   = require('node-uuid');
const jwt 	   	   = require('jsonwebtoken');
const secret	       = 'myTokenSecret';


module.exports = function(router){


	router.post('/user/register', function(req, res){
		//console.log(JSON.stringify(req.body));
		console.log("in path: /users/register");

		var user = new User();
		user.uuid = uuid.v4();
		user.username = req.body.username;
		user.password = req.body.password;
		user.email 	  = req.body.email;
		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' ) {
			res.json({	success:false, message:'Ensure username, password and email were provided'	});
		} else {
			user.save(function(err){
				if (err) { //check validation, then duplication, otherwise send the json response
					if(err.errors != null ){
						//res.json({	success:false, message:'username or email already exists'	});
						if(err.errors.email) {
							console.log(err.errors.email);
							res.json({	success:false, message: err.errors.email.message	});
						} else if(err.errors.username) {
							res.json({	success:false, message: err.errors.username.message	});
						} else if(err.errors.password) {
							res.json({	success:false, message: err.errors.password.message	});
							//if err not validation-related, could be duplicate user
						} else{
							res.json({	success:false, message: err	});
						} //note we're checking for err.errors THEN simply just err
					} else if (err) {
						//signifies duplicate record
						if(err.code == 11000){
							res.json({ success: false, message: 'Username or E-mail already taken' });
						} else{
							res.json({	success:false, message: err	});
						}
					}
				} else {
					res.json({	success:true, message:'User registered to Database'	});
				}
			});
		}
	})



		router.post('/user/login',function(req,res){
			console.log("in path: /users/login");
			//res.send('testing authenticate route');
			User.findOne({ username: req.body.username}).select('username email uuid password').exec(function(err, user){
				if(err) throw err;
				console.log("inside findOne clause");
				console.log(JSON.stringify(user));

				if(!user) { //if user does not exist
					res.json({ success:false, message: 'Could not authenticate user'});
				}
				else if(user) {
					if(req.body.password) { //if a value is provided
						var validPassword = user.comparePassword(req.body.password);
					}
					else {
						res.json({ success:false, message: 'No password provided'})
					}
					if(!validPassword) {
						res.json({ success:false, message: 'Could not authenticate password'})
					}
					else {
						//we're going to decrypt this token, then send it back to the '/me' path, using the middleware declared below

						var token = jwt.sign({ uuid: user.uuid, username: user.username, email: user.email }, secret, { expiresIn: '1hr' });
						res.json({ success:true, message: 'User authenticated', token:token});
					}
				}
			});
		});

		router.post('/word/addSynonym',function(req,res){
			console.log("You made it to the /api/addSynonym route");

			console.log("Entire req.body value is :: %s", JSON.stringify(req.body));
			console.log("*** *** ***");
			var a = req.body;

			//we use 'a' to maintain easy readibility throughout
			console.log("Value of new variable 'a' is :: %s",JSON.stringify(a));

			if(req.body == null || req.body == '') {
				res.json({	success:false, message:'Ensure base word and at least 1 synonym is provided'	});
			} else {

					//if user tries to enter empty String, we have dealt with this back in our controller
					//eg - [a,,,b,,c,,,,,d] becomes [a,b,c,d]

						console.log("***ATTEMPTING TO LOOP OUR LIST OF WORDS AND MATCHING SYNONYMS***");
					    var key, value;
					    for (key in a) {
					        if (a.hasOwnProperty(key)) {
										console.log("New iteration of loop through our keys and values that we'll enter into the database");
										console.log("*** *** ***");
										console.log("the current key is :: %s", key);
										console.log("the current values are :: %s", a[key]);

										//during this mapping, remember that
										// 	return {synonym} //the string literal 'synonym' becomes the key
										// and
										// 	return synonym //index-based keys
										// populate the new variable completely different. simple error to make
										var currentSynonyms = a[key].map(function(synonym) {
											return synonym;
										});


										console.log("Current iteration's synonym values are :: %s", JSON.stringify(currentSynonyms));

											Word.update(
												{ "baseWord": key },
												{  $addToSet:  {
													synonyms: {
														//pushes each of the current synonyms as objects, into the array property 'Synonyms', for the current baseWord
															$each: currentSynonyms.map(synonym =>
																//  ({ "synonym":synonym })
																(synonym)
															)}
													}},
												{ upsert : true },
												function(err, raw){
														console.log("Errors:" + err);
														console.log("Raw:" + JSON.stringify(raw));
														if(err) res.json({ success:false, message: "There was an error processing your entries, please try again."});
												}
											);

									};
					    }
							res.json({ success:true, message: "Entries performed successfully"});
			}
		});

	router.post('/word/findSynonym', function(req,res){
		console.log("we've hit /word/findSynonym route, searching for words...");
		console.log(req.body);
		console.log(req.body.baseWord);


		Word.find({ baseWord : req.body.baseWord }).select(' baseWord synonyms').exec(function(err, baseWords){
			if(err) throw err;

			//Did we find a word?
			if(baseWords.length > 0) {

				try{
					res.json({ success:true, message: "We found the following synonyms: ", reminder:"Found synonyms for this word, look below", word:baseWords});
					console.log("Words found and should have been returned to client ... " + baseWords);
				} catch(err){
					res.json({ success:false, message: "No synonyms found: " });
					console.log("There was the following error : %s", err);
				}
			}
			else {
				res.json({ success:false, message: "No synonyms found: " });
			}

		});

	});

	router.get('/word/listWords', function(req,res){
		console.log("we've hit /word/listWords route, searching for words...");

		Word.find({  }).select(' baseWord synonyms').exec(function(err, words){
			if(err) throw err;

			if(words.length > 0) {
				console.log("hi");
				try{
					// setTimeout(function(){ console.log("huhuhuhuh") }, 3000);
					console.log("hi2");
					// console.log(words);

					res.json({ success:true, message: "We found the following list of words: ", words:words});
					// console.log("Words found and should have been returned to client ...");
				} catch(err){
					// res.json({ success:false, message: "No words found: " });
					// console.log("There was the following error : %s", err);
				}
			}
			else {
				console.log("hi3");
				res.json({ success:false, message: "No words found: " });
			}

		});
		console.log("hi4");
		//res.json({ success:true, message: "No words found: " });		

	});

	router.use(function(req, res, next){
		//can get token through 1) request, 2) url, or 3) headers. we are sending through the req.header in this app
		var token = req.body.token || req.body.query || req.headers['x-access-token'];

		if(token) { //ie - if there's a token
			// verify a token symmetric, secret defined at top of this module
			jwt.verify(token, secret, function(err, decoded) {
				//could arrive here if token has expired, as it'll still be detected in browser window..
				if(err) {
					res.json({ success: false, message:'Token invalid, an error occurred: ' + err	});
				}
				else{
					req.decoded = decoded;
					next(); //without this function call, the request cannot continue
				}
			});

		} else {
			res.json({ success:false, message: 'No token provided'});
		}

	});

	router.post('/user/info',function(req,res){
		//the app.use() function directly above this POST route provides req.decoded with our token details
		//containing info about the user
		res.send(req.decoded);
	});





	return router;

}
