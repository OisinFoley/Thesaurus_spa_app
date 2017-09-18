console.log('testing thesaurus Ctrl');

angular.module('thesaurusController',['thesaurusServices'])

.controller('thesaurusCtrl',function($rootScope, $scope, Word){

	var app = this;

	app.findWord = function(wordData,valid){
		console.log("in the findWord function");

		console.log(app.wordData);
		if(valid){
			Word.addSynonym(app.wordData).then(function(data){	
				if(data.data.success){
					//lost scope of 'this' in here, hence use of var app
					app.loading = false;				
					
					console.log(data.data.message);

					 //app.successMsg = data.data.message;

					//this is a test
					app.errorMsg = data.data.message;

					//just adding timeout for effect
					// $timeout(function(){
					// 	//acts as simple redirect
					// 	$location.path('/login');
					// }, 2000);								
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

	// app.addSynonym = function(wordData, valid){
	// 	if(valid){
	// 		Word.addSynonym(app.wordData).then(function(data){	
	// 			if(data.data.success){
	// 				//lost scope of 'this' in here, hence use of var app
	// 				app.loading = false;				
					
	// 				console.log(data.data.message);

	// 				 //app.successMsg = data.data.message;

	// 				//this is a test
	// 				app.errorMsg = data.data.message;

	// 				//just adding timeout for effect
	// 				// $timeout(function(){
	// 				// 	//acts as simple redirect
	// 				// 	$location.path('/login');
	// 				// }, 2000);								
	// 			}
	// 			else{
	// 				app.loading = false;
	// 				app.errorMsg = data.data.message;
	// 			}
	// 		});						
	// 	} else {
	// 		//error message created due to wordForm.$valid's value in our thesaurus view
	// 		app.loading = false;
	// 		app.errorMsg = 'Please ensure form is filled out properly';
	// 	}

	// }

	// app.findSynonym = function(wordData, valid){
	// 	if(valid){
	// 		Word.findSynonym(app.wordData).then(function(data){	
	// 			if(data.data.success){
	// 				//lost scope of 'this' in here, hence use of var app
	// 				app.loading = false;				
					
	// 				console.log(data.data.message);

	// 				 //app.successMsg = data.data.message;

	// 				//this is a test
	// 				app.errorMsg = data.data.message;

	// 				//just adding timeout for effect
	// 				// $timeout(function(){
	// 				// 	//acts as simple redirect
	// 				// 	$location.path('/login');
	// 				// }, 2000);								
	// 			}
	// 			else{
	// 				app.loading = false;
	// 				app.errorMsg = data.data.message;
	// 			}
	// 		});						
	// 	} else {
	// 		//error message created due to wordForm.$valid's value in our thesaurus view
	// 		app.loading = false;
	// 		app.errorMsg = 'Please ensure form is filled out properly';
	// 	}

	// }




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