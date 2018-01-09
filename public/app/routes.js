// // this is listed as a dependency of 'mainModule.js' which grants us access throughout our app
// var app = angular.module('appRoutes',['ngRoute'])


// .config(function($routeProvider, $locationProvider){
// //on index page, hrefs needs to be '#/abcd' because of Angular, normally just '/' will suffice
// 	$routeProvider
// 	.when('/', {
// 		templateUrl: 'app/views/home.html'
// 	})
// 	.when('/register', {
// 		templateUrl: 'app/views/pages/users/register.html',
// 		controller: 'registerCtrl',
// 		controllerAs: 'register'
// 	})
// 	.when('/login', {
// 		 templateUrl: 'app/views/pages/users/login.html',
// 	})
// 	.when('/thesaurus', {
// 		templateUrl: 'app/views/pages/thesaurus/thesaurus.html',
// 		controller: 'thesaurusCtrl',
// 		controllerAs: 'thesaurus'
// 	})
// 	.otherwise({ redirectTo: '/' }) //handles unrecognised values

// 	//when navigating routes, we normally need to start the path with '#/login' or '#/register'
// 	//this code snippet, along with '<base href="">'' attribute set in home.html will allow us to remove the '#' at the start of the path
// 	$locationProvider.html5Mode({
// 	  enabled: true,
// 	  requireBase: false
// 	});


// });

// var routerApp = angular.module('appRoutes', ['ui.router']);
var routerApp = angular.module('appRoutes', ['ui.router'])


routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
    		       
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            // templateUrl: 'partial-home.html'
            // templateUrl: 'app/views/pages/users/register.html'
            templateUrl: 'app/views/home.html'            
        })

        .state('/thesaurus', {
        	url: '/thesaurus',
			templateUrl: 'app/views/pages/thesaurus/thesaurus.html',			
			controller: 'thesaurusCtrl',
			controllerAs: 'thesaurus'
		})
        
        // nested list with custom controller
        .state('home.list', {
            url: '/list',
            templateUrl: 'partial-home-list.html',
            controller: function($scope) {
                $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
            }
        })
        
        // nested list with just some random string data
        .state('home.paragraph', {
            url: '/paragraph',
            template: 'I could sure use a drink right now.'
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            url: '/about',
            views: {
                '': { templateUrl: 'partial-about.html' },
                'columnOne@about': { template: 'Look I am a column!' },
                'columnTwo@about': { 
                    templateUrl: 'table-data.html',
                    controller: 'scotchController'
                }
            }
            
        });
        
});

// angular.module('thesaurusController',['thesaurusServices'])
routerApp.controller('thesaurusCtrl' ,function($scope, Word) {

// .controller('thesaurusCtrl',function($scope, Word, $timeout){

	var app = this;
	//app.loading = true;

	app.addSynonym = function(wordData,valid){
		console.log("in the addSynonym function");

		var baseWord = [];
		baseWord.push(app.wordData.baseWord);
		var synonyms = app.wordData.synonym.split(',');
		var words = baseWord.concat(synonyms);
		console.log(words);
		console.log(words.length);
		//if user tries to enter empty String, we will catch it here
		//eg - [a,,,b,,c,,,,,d] becomes [a,b,c,d]
		words=words.filter(Boolean);
		console.log("Empty Strings removed!");
		console.log(words);
		console.log(words.length);

		//and new code
		//put result into an object
		var dictionary = {};
		for (var i = 0, w; w = words[i]; ++i) {
		  //take each word (w)
		  dictionary[w] = words.filter(function(word) {
		    return word != w;//all words except w
		  });
		}
		//take the object
		console.log(dictionary);
		//or stringify it
		console.log(JSON.stringify(dictionary));

		app.loading = true;
		//console.log(app.wordData);
		if(valid){
			//trying to remove old server messages if user sends a second POST request but hasn't refreshed from the first POST
			app.successMsg = false;
			app.errorMsg = false;

			//console.log(app.wordData);
			// Word.addSynonym(app.wordData).then(function(data, wordData){
			Word.addSynonym(dictionary).then(function(data, wordData){

				if(data.data.success){
					//lost scope of 'this' in here, hence use of var app
					app.loading = false;
					app.wordData = null;
						//this is the correct way to clear form, but isn't performing as hoped
						// $scope.regForm.$setPristine();
						// $scope.regForm.$setUntouched();

					console.log(data.data.message);

					app.successMsg = data.data.message;
				}
				else{
					app.loading = false;
					app.errorMsg = data.data.message;
				}
			});

		} else {
			//error message created due to wordForm.$valid's value in our thesaurus view
			app.loading = false;
			app.errorMsg = 'Please ensure form is filled out properly';
		}
	};





	//no need for 'valid' like in app.addSynonym() as 'valid' is not initialised until ng-submit executes.
	//the client will send undefined if the regex fails	which is why we check that wordData != undefined
	app.findSynonym = function(wordData){

		app.loading = true;

		//our app will not break without this check for undefined, but it's good practice
		if(app.wordData != undefined){
			//call our factory service
			Word.findSynonym(app.wordData).then(function(data){
				if(data.data.success){

					// app.loading = false;
					//timeout only used for demonstration, as response may be too quick to see spinner animation on high-speed connection
					$timeout(function(){
						 app.loading = false;
					}, 500);

					console.log("the FINDSYNONYMS SYNOYNMS ARE :: %S",data.data.word[0].synonyms)
					
					//we are returned an array from the database, so even though we will usually get only one index,
					//we must specifiy the zeroth index to access our synonyms
					console.log(JSON.stringify(data.data.word[0].synonyms));

					app.synonymMsg = data.data.message;
					app.reminderMsg = data.data.reminder;

					app.synonyms = data.data.word[0].synonyms;
					;

				}
				else{
					app.loading = false;
					app.synonyms = false;
					app.synonymMsg = data.data.message;

				}
			});
		} else {
			//error message created due to wordForm.$valid's value in our thesaurus view
			app.loading = false;
			app.errorMsg = 'Please ensure form is filled out properly';
		}
	};




	app.loadAllWords = function(){
			// app.loading = true;

			Word.listWords().then(function(data){
				if(data.data.success){
					//lost scope of controller's 'this' keyword, hence use of var app
					//app.loading = false;

					// console.log("the response is :: %s",JSON.stringify(data.data.words));

					app.wordsList = data.data.words;
					console.log("words is :: %s", JSON.stringify(data.data.words));


					//app.successMsg = data.data.message;

					// app.errorMsg = data.data.message;

				}
				else{
					//app.loading = false;
					// app.errorMsg = data.data.message;
				}
			});
	}

});

routerApp.factory('Word', function($http){
    var wordFactory = {};

    wordFactory.listWords = function(){
        return $http.get('/api/word/listWords');
    };

    return wordFactory;
});

routerApp.controller('scotchController' ,function($scope, Word) {
    
    // , 'Word'

    $scope.message = 'test';
    console.log("yo");
    
    // $scope.test = Word.listWords;

    $scope.test = function(){
        Word.listWords().then(function(data){
            if(data.data.success){
                
                console.log("words is :: yes test yest");

            }
            else{
                
                console.log("words is :: no tets no");
            }
        });    
    }

        
    

   
    $scope.scotches = [
        {
            name: 'Macallan 12',
            price: 50
        },
        {
            name: 'Chivas Regal Royal Salute',
            price: 10000
        },
        {
            name: 'Glenfiddich 1937',
            price: 20000
        }
    ];
    
});

// routerApp.module("thesaurusServices",[])
routerApp.factory('Word', function($http){
    var wordFactory = {};

    wordFactory.listWords = function(){
        return $http.get('/api/word/listWords');
    };

    return wordFactory;
});