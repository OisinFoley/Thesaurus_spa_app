angular.module("authServices",[])

.factory("Auth", function($http, AuthToken){
	var authFactory = {};

//we're going to create a function that can be used all throughout our application(DRY)
	authFactory.login = function(loginData){
		return $http.post('/api/user/login', loginData).then(function(data){
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

	authFactory.getUserInfo = function(){
		if(AuthToken.getToken()) {
			return $http.post('/api/user/info');
		} else {  
			//$q rejects the request, preventing an error
			$q.reject({ message: 'user has no token '});
		}
	}

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

//in mainModule.js, we use $httpProvider.interceptor.
//this allows us to grab our request and execute a service before it reaches our API.
//we're executing this service below, which attaches the browser token to the request header.
//without this piece of code, the app will always think we're offline when accessing '/api/user/info'

.factory('AuthInterceptors', function(AuthToken){
	var authInterceptorsFactory = {};

	authInterceptorsFactory.request = function(config){
		var token = AuthToken.getToken();		
		config.headers['x-access-token'] = token;
	
		return config;
	}

	return authInterceptorsFactory;
});

