angular.module("authServices",[])

.factory("Auth", function($http){
	var authFactory = {};

//we're going to create a function that can be used all throughout our application(DRY)
	authFactory.login = function(loginData){
		return $http.post('/api/users/login', loginData).then(function(data){
			// console.log(data.data.token);
			console.log(data.data);

			//AuthToken.setToken(data.data.token);
			return data;
		});
	}

	return authFactory;

})