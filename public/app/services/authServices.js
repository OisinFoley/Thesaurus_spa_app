angular.module("authServices",[])

.factory("Auth", function($http, AuthToken){
	var authFactory = {};

//we're going to create a function that can be used all throughout our application(DRY)
	authFactory.login = function(loginData){
		return $http.post('/api/users/login', loginData).then(function(data){
			// console.log(data.data.token);
			console.log(data.data);


			AuthToken.setToken(data.data.token);
			return data;
		});
	}

	authFactory.isLoggedIn = function(){
		//if there's a token
		if(AuthToken.getToken()) {
			return true;
		}
		else{
			return false;
		}
	};

	authFactory.logout = function(){
		AuthToken.setToken();
	};

	return authFactory;

})


.factory('AuthToken', function($window){
	var authTokenFactory = {};	


	//AuthToken.setToken(token)
	authTokenFactory.setToken = function(token){
		if(token) {
			$window.localStorage.setItem('token', token);	
		} else {
			$window.localStorage.removeItem('token');
		}

		
	}
	//AuthToken.getToken()
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	}


	return authTokenFactory;
})

