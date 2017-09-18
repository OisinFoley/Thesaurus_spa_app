// this is listed as a dependency of 'mainModule.js' which grants us access throughout our app
var app = angular.module('appRoutes',['ngRoute'])


.config(function($routeProvider, $locationProvider){
//on index page, hrefs needs to be '#/abcd' because of Angular, normally just '/' will suffice
	$routeProvider
	.when('/', {
		templateUrl: 'app/views/home.html'
	})	
	.when('/register', { 
		templateUrl: 'app/views/pages/users/register.html',
		controller: 'registerCtrl',
		controllerAs: 'register'
	})
	.when('/login', { 		
		 templateUrl: 'app/views/pages/users/login.html',		
	})		
	.when('/thesaurus', { 
		templateUrl: 'app/views/pages/thesaurus/thesaurus.html',
		controller: 'thesaurusCtrl',
		controllerAs: 'thesaurus'
	})
	.otherwise({ redirectTo: '/' }) //handles unrecognised values

	//when navigating routes, we normally need to start the path with '#/login' or '#/register'
	//this code snippet, along with '<base href="">'' attribute set in home.html will allow us to remove the '#' at the start of the path
	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	});

	
});
	
