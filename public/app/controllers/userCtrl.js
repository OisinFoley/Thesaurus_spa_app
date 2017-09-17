
angular.module("userControllers",[])



.controller('registerCtrl', function($http, $location, $timeout){

	var app = this;
	
	app.regUser = function(regData, valid){
		
				

		console.log("we've hit regUser")					
		
	};
	
	this.checkUsername = function(regdata){
		
		console.log("hit check username");
		
	}

	this.checkEmail = function(regdata){
		

		console.log("hit check email");
		
	}
});
