

angular.module('userServices',[])
.factory('User', function($http){

	console.log("this is a log from USER SERVICES");

	var userFactory = {};


	userFactory.registerUser = function(registerData){
		return $http.post('/api/user/register', registerData);
	}

	return userFactory;

})