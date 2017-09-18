angular.module("thesaurusServices",[])

.factory('Word', function($http){
	var wordFactory = {};


	//we might not need this, as if we try to add a synonym, we will search for the base word first and ..
	//the way mongo's ".update" function works is that if it can't find a document to update, then it simply inserts it instead
	wordFactory.addWord = function(wordData){
		$http.post('/api/addWord', wordData);
	};

	wordFactory.addSynonym = function(synonymData){
		//console.log('in thesaurusServices, data passed from Ctrl is :: %s',JSON.stringify(synonymData));
		return $http.post('/api/word/addSynonym', synonymData);
	};

	wordFactory.findSynonym = function(synonymData){
		$http.post('/api/findSynonym', synonymData);
	};

	wordFactory.listWords = function(){
		$http.post('/api/listWords');
	};

	return wordFactory;
});