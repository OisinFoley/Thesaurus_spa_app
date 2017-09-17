console.log('testing main Ctrl');

angular.module('mainCtrl',['authServices'])

.controller('mainCtrl',function($rootScope, $scope, Auth){

	var app = this;

	//Use this to check login status each time the view changes.
	//Without this we would have to refresh the browser to check the user's login status
	$rootScope.$on('$routeChangeStart', function() {
		//calls the service upon view change
		if(Auth.isLoggedIn()) {
			console.log("STATUS: user is logged in");
			app.isLoggedIn = true;
			Auth.getUserInfo().then(function(data){
								
				//now we have access to the user's info throughout the app
				//we can also personalise the app by displaying their name
				console.log(JSON.stringify(data.data));
				app.uuid = data.data.uuid;
				app.username = data.data.username;
				app.useremail = data.data.email; 				
			});
			
		}
		else {
			console.log("STATUS: user is NOT logged in");								
		}		
	});

	this.loginUser = function(loginData){	
		
		console.log('login form submitted');	

		Auth.login(app.loginData).then(function(data){
			if(data.data.success) {
				console.log("login successful, users details:: %s", data.data.message);
			}
			else{				
				app.errorMsg = data.data.message;
			}
		});
	};


	app.checkAuthStatus = function(){
		if(Auth.isLoggedIn()) {
			console.log("STATUS: user is logged in");
			app.isLoggedIn = true;			
		}
		else {
			console.log("STATUS: user is NOT logged in");								
		}		
	}


		
	

	app.logout = function(){
		console.log("In main.logout functions");								
		Auth.logout();				
	};


	
});