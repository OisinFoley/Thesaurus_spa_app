var User  		   = require('../models/user');
var uuid = require('node-uuid');


module.exports = function(router){


	router.post('/user/register', function(req, res){
		console.log(JSON.stringify(req.body));
		res.json({ success:true, message:'in user/register api route' });
	})

	return router;

}
