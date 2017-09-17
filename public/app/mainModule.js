/* This module is the core of our app, and all other modules such as controllers and services feed off of this mainModule */

/* This module is injected into the body of our home.html file */

angular.module('appCore',['appRoutes','userControllers','ngAnimate','mainCtrl','userServices', 'authServices'])

.config(function(){
	console.log('testing main app config');	
});

