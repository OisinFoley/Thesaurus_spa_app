var User  		   = require('../models/user');
var uuid = require('node-uuid');


module.exports = function(router){


	router.post('/user/register', function(req, res){
		console.log(JSON.stringify(req.body));
		console.log("in path: /users/register");

		var user = new User();		
		user.uuid = uuid.v4();
		user.username = req.body.username;
		user.password = req.body.password;
		user.email 	  = req.body.email;		
		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' ) {			
			res.json({	success:false, message:'ensure uname, password and email were provided'	});
		} else {
			user.save(function(err){
				if (err) { //check validation, then duplication, otherwise send the json response
					if(err.errors != null ){
						//res.json({	success:false, message:'username or email already exists'	});
						if(err.errors.name) {
							console.log(err.errors.name);
							res.json({	success:false, message: err.errors.name.message	}); 	
						} else if(err.errors.email) {						
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



	router.post('/users/login',function(req,res){
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
					res.json({ success:false, message: 'no password provided'})
				}
				if(!validPassword) {
					res.json({ success:false, message: 'could not authenticate password'})
				}
				else {
					//we're going to decrypt this token, then send it back to the '/me' path, using the middleware directly below
					
					res.json({ success:true, message: 'user authenticated', user:user });

					// var token = jwt.sign({ id: user._id, uuid: user.uuid, username: user.username, email: user.email }, secret, { expiresIn: '1hr' });
					// res.json({ success:true, message: 'user authenticated', token:token});
				}
			}
		});
	});

	return router;

}
