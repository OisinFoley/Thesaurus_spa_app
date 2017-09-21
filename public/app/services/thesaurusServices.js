angular.module("thesaurusServices",[])

.factory('Word', function($http){
	var wordFactory = {};


	wordFactory.addSynonym = function(synonymData){
		//console.log('in thesaurusServices, data passed from Ctrl is :: %s',JSON.stringify(synonymData));
		return $http.post('/api/word/addSynonym', synonymData);
	};

	wordFactory.findSynonym = function(synonymData){
		//console.log('in thesaurusServices, data passed from Ctrl is :: %s',JSON.stringify(synonymData));
		return $http.post('/api/word/findSynonym', synonymData);
	};

	wordFactory.listWords = function(){
		return $http.get('/api/word/listWords');
	};

	return wordFactory;
});