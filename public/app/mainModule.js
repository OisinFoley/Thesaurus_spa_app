/* This module is the core of our app, and all other modules such as controllers and services feed off of this mainModule */

/* This module is injected into the body of our index.html file */

angular.module('appCore',['appRoutes','userControllers','ngAnimate','ui.bootstrap','mainCtrl','userServices', 'authServices','thesaurusController','thesaurusServices'])

.config(function($httpProvider){

	// console.log('testing connection to mainModule.js module');
	$httpProvider.interceptors.push('AuthInterceptors');
});
