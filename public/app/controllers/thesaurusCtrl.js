// console.log('testing connection to thesaurus Ctrl');

angular.module('thesaurusController',['thesaurusServices'])

.controller('thesaurusCtrl',function($scope, Word, $timeout){

	var app = this;
	//app.loading = true;

	app.addSynonym = function(wordData,valid){
		console.log("in the addSynonym function");


/*
		beginning to look into also adding each of the synonyms as a base word,
		if I enter 2 synonyms for a 'Dog', I expect to be able to look up those syonyms and have the word 'Dog' returned

		eg - base word -> synonym entered
			 dog       -> canine, mutt
		then automatically enter:
			 canine    -> dog
			 mutt      -> dog
*/

		// // var baseWord = app.wordData.baseWord;
		// var baseWord2 = app.wordData.baseWord;
		// var baseWord = [];
		// baseWord.push(baseWord2);
		//
		// // var entriesArr = [];
		// // entriesArr.push(baseWord);
		// var words = app.wordData.synonym.split(",");
		// //console.log(words.length);
		//
		// words = baseWord.concat(words);
		// console.log(words.length);
		// //entriesArr.push(synonyms);
		// //console.log(entriesArr.length);
		//
		//
		// console.log(words.length);
		// var keys = [];
		// var values = [];
		// for(var i = 0; i < words.length; i++){
		// 	keys.push(words[i]);
		//
		//
		// 	for(var x = 0; x < words.length; x++){
		//
		// 		var tempValues = words;
		// 		//console.log("tempvalues is :: %s", JSON.stringify(tempValues));
		// 			for(var o = 0; o < words.length; o++){
		// 				if(words[o] === words[x]){
		// 					tempValues.splice(tempValues[o]);
		// 				}
		// 				console.log(JSON.stringify(tempValues));
		// 			}
		// 			values.push(tempValues);
		// 		//values . pop (words[x]);
		// 		//tempValues.splice(tempValues.indexOf(words[x]));
		// 		//values.push(tempValues);
		// 	};
		// };
		// console.log("the minced keys array is :: %s", JSON.stringify(keys));
		//console.log("the minced values array is :: $s", JSON.stringify(values));


	/*
		var synonyms = app.wordData.synonym;
		// console.log("synonyms is :: %s", synonyms);
		synonyms = synonyms.split(",");
		var entriesArr = [];
		entriesArr.push({  });
		synonyms.forEach(individualSynonym ,index){
			entriesArr.push({   })
		}
	*/

		app.loading = true;
		//console.log(app.wordData);
		if(valid){
			//trying to remove old server messages if user sends a second POST request but hasn't refreshed from the first POST
			app.successMsg = false;
			app.errorMsg = false;

			//console.log(app.wordData);
			Word.addSynonym(app.wordData).then(function(data, wordData){
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




	app.loadAllWords = function(){
			// app.loading = true;

			Word.listWords().then(function(data){
				if(data.data.success){
					//lost scope of controller's 'this' keyword, hence use of var app
					//app.loading = false;

					// console.log("the response is :: %s",JSON.stringify(data.data.words));

					app.wordsList = data.data.words;


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
