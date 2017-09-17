
angular.module("userControllers", ['userServices'])

.controller('registerCtrl', function($http, $location, $timeout, User){

	var app = this;
	
	app.regUser = function(regData){
		
		console.log("we've hit regUser")
		console.log(JSON.stringify(app.regData));			
		
		User.registerUser(app.regData);
		
	};
	
	this.checkUsername = function(regdata){
		
		console.log("hit check username");
		
	}

	this.checkEmail = function(regdata){
		

		console.log("hit check email");
		
	}
});
