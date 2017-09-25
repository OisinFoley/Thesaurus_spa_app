// console.log('testing connection to main Ctrl');

angular.module('mainCtrl',['authServices'])

.controller('mainCtrl',function($rootScope, $scope, Auth, $timeout, $location){

	var app = this;
	
	$scope.linkStyles = {
		"color":"yellow"
	}

	//Use this to check login status each time the view changes.
	//Without this we would have to refresh the browser to check the user's login status
	$rootScope.$on('$routeChangeStart', function() {
		//calls the service upon view change
		if(Auth.isLoggedIn()) {
			console.log("STATUS: user is logged in");
			// app.isLoggedIn = true;
			Auth.getUserInfo().then(function(data){

				//now we have access to the user's info throughout the app
				//we can also personalise the app by displaying their name
				console.log(JSON.stringify(data));

				console.log(JSON.stringify(data.data));
				app.uuid = data.data.uuid;
				app.username = data.data.username;
				app.useremail = data.data.email;
				if(app.username) { 
					app.isLoggedIn = true; 
				} else { 
					app.isLoggedIn = false;	
				}
									
			});

		}
		else {
			console.log("STATUS: user is NOT logged in");
		}
	});



	this.loginUser = function(loginData){

		//console.log('login form submitted');
		app.loading = true;
		Auth.login(app.loginData).then(function(data){
			if(data.data.success) {
				app.loading = false;

				//previously set incorrect login message removed
				app.errorMsg = false;
				//new successful login message set
				app.successMsg = data.data.message + '....Redirecting....';
				//emptying form
				app.loginData = null;

					//this is the correct way to clear form, but isn't performing as hoped
					// $scope.regForm.$setPristine();
					// $scope.regForm.$setUntouched();

				//user doesn't need to stay here after successful login, so redirect them
				$timeout(function(){
					//acts as simple redirect
					$location.path('/thesaurus');
				}, 2000);

			}
			else{
				app.loading = false;
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
