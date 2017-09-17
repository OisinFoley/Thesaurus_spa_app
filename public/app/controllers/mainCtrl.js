console.log('testing main Ctrl');

angular.module('mainCtrl',['authServices'])

.controller('mainCtrl',function($scope, Auth){

	var app = this;

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
	
});