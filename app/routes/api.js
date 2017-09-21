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
								

		if(req.body.baseWord == null || req.body.baseWord == '' || req.body.synonym == null || req.body.synonym == '' ) {			
			res.json({	success:false, message:'Ensure base word and at least 1 synonym is provided'	});
		} else {
				//allowed user to enter multiple values at once, improves experience
				var individualSynonyms = req.body.synonym.split(',');
				
				console.log(JSON.stringify(individualSynonyms));
				//if user tries to enter empty String, we will catch it here
				//eg - [a,,,b,,c,,,,,d] becomes [a,b,c,d]
				individualSynonyms = individualSynonyms.filter(Boolean);
				var synonyms = individualSynonyms.join();
				
				    Word.update(								
						{ "baseWord": req.body.baseWord },						
						{  $addToSet:  {
							synonyms: {								   								
								$each: synonyms.split(',').map(synonym =>							
										({ uuid: uuid.v4, synonym })								
									)
								}   
							}},  
						{ upsert : true },
						//reason for splitting and rejoing above array(instead of running a loop) is so we can now access 
						//this callback. if we had created a loop, app would've thrown "multiple headers" exception
						function(err, result) {						    
						    if (err){						    	
						    	res.json({	success:false, message:'Error adding base word and synonym, try again or come back later.'	});
						    	console.log("Error updating word and synonym document");						    	
						    } 
						    else {
						    	res.json({	success:true, message:'Word and synonyms added!'	});
						    	console.log("Update of Word document successful, check document list");
						    }						    
						});					    					
		}	
	});

	router.post('/word/findSynonym', function(req,res){	
		console.log("we've hit /word/findSynonym route, searching for words...");
		
		Word.find({ baseWord : req.body.baseWord }).select(' baseWord synonyms').exec(function(err, baseWords){
			if(err) throw err;
			
			if(baseWords.length > 0) {

				try{				
					res.json({ success:true, message: "We found the following synonyms: ", reminder:"Found synonyms for this word, look below", word:baseWords});
					console.log("Words found and should have been returned to client ...");
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

				try{				
					res.json({ success:true, message: "We found the following list of words: ", words:words});
					console.log("Words found and should have been returned to client ...");
				} catch(err){
					res.json({ success:false, message: "No words found: " });					
					console.log("There was the following error : %s", err);
				}
			}
			else {
				res.json({ success:false, message: "No words found: " });					
			}
			
		});
		
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
