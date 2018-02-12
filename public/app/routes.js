// // this is listed as a dependency of 'mainModule.js' which grants us access throughout our app
// var app = angular.module('appRoutes',['ngRoute'])



// 	//when navigating routes, we normally need to start the path with '#/login' or '#/register'
// 	//this code snippet, along with '<base href="">'' attribute set in home.html will allow us to remove the '#' at the start of the path
// 	$locationProvider.html5Mode({
// 	  enabled: true,
// 	  requireBase: false
// 	});


// });

// var routerApp = angular.module('appRoutes', ['ui.router']);
var routerApp = angular.module('appRoutes', ['ui.router','mainCtrl'])


routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
    		       
        // HOME STATES AND NESTED VIEWS ========================================
        
        .state('thesaurus', {        	
    		url: '/thesaurus',	
    		templateUrl: 'app/views/pages/thesaurus/thesaurus.html',
			controller: 'thesaurusCtrl',
			controllerAs: 'thesaurus',	

			//https://stackoverflow.com/questions/25316591/angularjs-ui-router-state-reload-child-state-only
			//this might be of use, could make another child-state for the displaying of the found words
			//and then when typing occurs, make a reload of that state with the async call we desire..	

			resolve: {		            

	            antonymsWordsList: function(Word) {		            	
	            	return Word.listAntonynms();	            	
	            },
	            synonymsWordsList: function(Word) {		            	
	            	return Word.listSynonynms();	            	
	            }
	            
	        }		        
		})

  		.state('thesaurus.synonyms', {
            url: '/synonyms',
            templateUrl: 'app/views/pages/thesaurus/thesaurus-synonyms.html', 
            controller: 'thesaurusSynonymsCtrl',
			controllerAs: 'thesaurus'
        })

        // .state('thesaurus.synonyms.searchResult', {
        //     url: '/synonyms/searchResult',
        //     templateUrl: 'app/views/pages/thesaurus/search-result.html',            
        // })
        
        // nested list with custom controller
        .state('thesaurus.antonyms', {
            url: '/antonyms',
            templateUrl: 'app/views/pages/thesaurus/thesaurus-antonyms.html',
            controller: 'thesaurusAntonymsCtrl',
			controllerAs: 'thesaurus'
        })
                       
        .state('home', {
            url: '/home',            
            templateUrl: 'app/views/home.html'            
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

routerApp.directive('thesaurusForm', function() {
	return{
		templateUrl: 'app/components/thesaurus-form.html'
	}
      
});

routerApp.directive('thesaurusAllWords', function() {
	return{
		templateUrl: 'app/components/thesaurus-all-words.html'      	
	}
      
});

routerApp.directive('wordsLookup', function() {
	return{
		templateUrl: 'app/components/words-lookup.html'//,
      	// bindings: { name: '@' }	
      	// controller: 'thesaurusCtrl',
      	// controllerAs: 'thesaurus'
	}
      
});

routerApp.controller('thesaurusAntonymsCtrl' ,function($scope, Word, wordsList, $state, $http, $timeout) {

	var app = this;

	app.findSynonym = function(query, wordData, Word, findSynonym){

		app.loading = true;
		console.log("pre POST word data is ::" + app.wordData);		
		console.log("trying to find synonyms");

		var parammm = {baseWord: 'dog'};
		// $state.go('search', {query: 'do'}, {notify:false});
		// $state.go('search', {query: 'do'}, {notify:false}).then(function(data){
		// 	console.log("hi hi hi");
		// 	console.log("hi hi hi ::" + JSON.stringify(data));
		
		//our app will not break without this check for undefined, but it's good practice
		if(app.wordData != undefined){
		// 	//call our factory service

		// $state.go('search', {query: query});
		//console.log(Word);

			// Word.findSynonym(app.wordData).then(function(data){
			$http.post('/api/word/findSynonym', app.wordData).then(function(data){
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
			// Word.addSynonym(dictionary).then(function(data, wordData){
			$http.post('/api/word/addAntonym', dictionary).then(function(data, wordData){						

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
});

routerApp.controller('thesaurusSynonymsCtrl' ,function($scope, Word, $state, $http,$timeout) {

	var app = this;

	app.findSynonym = function(query, wordData, Word, findSynonym){

		console.log($state.current);
		console.log($state.current.name);


		app.loading = true;
		console.log("pre POST word data is ::" + app.wordData);		
		console.log("trying to find synonyms");

		var parammm = {baseWord: 'dog'};
		// $state.go('search', {query: 'do'}, {notify:false});
		// $state.go('search', {query: 'do'}, {notify:false}).then(function(data){
		// 	console.log("hi hi hi");
		// 	console.log("hi hi hi ::" + JSON.stringify(data));
		
		//our app will not break without this check for undefined, but it's good practice
		if(app.wordData != undefined){
		// 	//call our factory service

		// $state.go('search', {query: query});
		//console.log(Word);

			// Word.findSynonym(app.wordData).then(function(data){
			$http.post('/api/word/findSynonym', app.wordData).then(function(data){
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
			// Word.addSynonym(dictionary).then(function(data, wordData){
			$http.post('/api/word/addSynonym', dictionary).then(function(data, wordData){						

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
});

// angular.module('thesaurusController',['thesaurusServices'])
routerApp.controller('thesaurusCtrl' ,function($scope, Word, synonymsWordsList, antonymsWordsList, $state, $http,$timeout) {

// .controller('thesaurusCtrl',function($scope, Word, $timeout){

	console.log("chicken wings");

	var app = this;
	//app.loading = true;

	app.loadAllWords = function(){
			// app.loading = true;

			console.log("i want to load words...");

			Word.listSynonynms().then(function(data){
				if(data.data.success){
					//lost scope of controller's 'this' keyword, hence use of var app
					//app.loading = false;
					// console.log("the response is :: %s",JSON.stringify(data.data.words));

					// app.wordsList = data.data.words;
					console.log("words is :: %s", JSON.stringify(data.data.words));

					//app.successMsg = data.data.message;
					// app.errorMsg = data.data.message;
				}
				else{
					console.log("nope");
					//app.loading = false;
					// app.errorMsg = data.data.message;
				}
			});
	}
	$scope.synonyms = synonymsWordsList.data.words;
	$scope.antonyms = antonymsWordsList.data.message;
	console.log($state.current.name);
	$state.current.name == 'thesaurus.antonyms'?$scope.wordsList = $scope.antonyms:$scope.wordsList = $scope.synonyms;
	
	
	//$scope.wordsList = $scope.synonyms;
	console.log($scope.wordsList);

});

routerApp.factory('Word', function($http){
    var wordFactory = {};

    wordFactory.listAntonynms = function(){
        return $http.get('/api/word/antonyms');
    };

    wordFactory.listSynonynms = function(){
        return $http.get('/api/word/synonyms');
    };
    

    wordFactory.findSynonym = function(synonymData){
		//console.log('in thesaurusServices, data passed from Ctrl is :: %s',JSON.stringify(synonymData));
		return $http.post('/api/word/findSynonym', synonymData);
		// return $http.post('/api/word/synonyms/:baseWord', synonymData);	
	};

	// wordFactory.findAntonym = function(synonymData){
	// 	//console.log('in thesaurusServices, data passed from Ctrl is :: %s',JSON.stringify(synonymData));
	// 	return $http.post('/api/word/findSynonym', synonymData);
	// 	// return $http.post('/api/word/synonyms/:baseWord', synonymData);	
	// };

	wordFactory.addSynonym = function(synonymData){
		//console.log('in thesaurusServices, data passed from Ctrl is :: %s',JSON.stringify(synonymData));
		return $http.post('/api/word/addSynonym', synonymData);
	};

    return wordFactory;
});


// .state('search', {        	
//     		// url: '/thesaurus/:query',	
//     		url: '/thesaurus/synonyms/:query',	    		
//     		templateUrl: 'app/views/pages/thesaurus/thesaurus-synonyms.html',
// 			controller: 'thesaurusCtrl',
// 			controllerAs: 'thesaurus',
// 			// params: { query	: null },

// 			resolve: {		            	       			
// 			    //these examples should get us to completion
// 			    //https://github.com/angular-ui/ui-router/wiki

// 	            findSynonysss:function($stateParams, Word, $http){
// 	  //           	// return Word.findSynonym($stateParams.query);
// 	  //           	return $http.post('/api/word/findSynonym', 'dog');
// 	  				// return Word.listWords();

// 	  				if($stateParams.query == undefined){
// 	  					return { data: '' };
// 	  				}

// 	  				var dog = { baseWord:'dog' };

// 	            		// Word.findSynonym(app.wordData).then(function(data){
// 	            		Word.findSynonym(dog).then(function(data){	            			
// 								if(data.data.success){

// 									// app.loading = false;
// 									//timeout only used for demonstration, as response may be too quick to see spinner animation on high-speed connection

// 									// $timeout(function(){
// 									// 	 app.loading = false;
// 									// }, 500);

// 									console.log("the FINDSYNONYMS SYNOYNMS ARE :: %S",data.data.word[0].synonyms)
									
// 									//we are returned an array from the database, so even though we will usually get only one index,
// 									//we must specifiy the zeroth index to access our synonyms
// 									console.log(JSON.stringify(data.data.word[0].synonyms));

// 									// app.synonymMsg = data.data.message;
// 									// app.reminderMsg = data.data.reminder;

// 									// app.synonyms = data.data.word[0].synonyms;
// 									return data.data.word[0].synonyms;

// 								}
// 								else{
// 									app.loading = false;
// 									app.synonyms = false;
// 									app.synonymMsg = data.data.message;

// 								}
// 							});	            	
// 	            }
// 	        }		        
// 		})