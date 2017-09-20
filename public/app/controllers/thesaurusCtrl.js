console.log('testing thesaurus Ctrl');

angular.module('thesaurusController',['thesaurusServices'])

.controller('thesaurusCtrl',function($scope, Word){

	var app = this;

	app.addSynonym = function(wordData,valid){
		console.log("in the findWord function");

		// $scope.wordForm.$setPristine();

		console.log(app.wordData);
		if(valid){
			//trying to remove old server messages if user sends a second POST request but hasn't refreshed from the first
			app.successMsg = false;
			app.errorMsg = false;
			
			console.log(app.wordData);
			Word.addSynonym(app.wordData).then(function(data, wordData){					 
				if(data.data.success){
					//lost scope of 'this' in here, hence use of var app
					app.loading = false;		
					app.wordData = null;		
					
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

		//console.log("testing function call from theaaurus view");
		//console.log(app.wordData);		
		
		//our app will not break without this check for undefined, but it's good practice
		if(app.wordData != undefined){		
			//call our factory service
			Word.findSynonym(app.wordData).then(function(data){	
				if(data.data.success){

					app.loading = false;				
															
					//we are returned an array from the database, so even though we will usually get only one index,
					//we must specifiy the zeroth index to access our synonyms
					console.log(JSON.stringify(data.data.word[0].synonyms));

					app.synonymMsg = data.data.message;
					app.reminderMsg = data.data.reminder;

					app.synonyms = data.data.word[0].synonyms;	
					
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




	// app.listWords = function(){
	// 	if(valid){
	// 		Word.listWords().then(function(data){	
	// 			if(data.data.success){
	// 				//lost scope of 'this' in here, hence use of var app
	// 				app.loading = false;				
					
	// 				console.log(data.data.message);

	// 				 //app.successMsg = data.data.message;

	// 				//this is a test
	// 				app.errorMsg = data.data.message;

	// 			}
	// 			else{
	// 				app.loading = false;
	// 				app.errorMsg = data.data.message;
	// 			}
	// 		});						
	// 	} else {
	// 		//error message created due to wordForm.$valid's value in our thesaurus view
	// 		app.loading = false;
	// 		app.errorMsg = 'There was a problem from the user side, please try again';
	// 	}

	// }
	

	


});