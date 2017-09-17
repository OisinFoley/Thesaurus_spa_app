/* This module is the core of our app, and all other modules such as controllers and services feed off of this mainModule */

/* This module is injected into the body of our index.html file */

angular.module('appCore',['appRoutes','userControllers','ngAnimate','mainCtrl','userServices', 'authServices'])

.config(function($httpProvider){

	console.log('testing mainModule.js module');	
	$httpProvider.interceptors.push('AuthInterceptors');
});

