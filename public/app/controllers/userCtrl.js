// console.log('testing connection to user Ctrl');

angular.module('userControllers', ['userServices'])

.controller('registerCtrl', function($rootScope, $scope, $http, $location, $timeout, User){

	var app = this;	
	
	app.regUser = function(regData, firstPassword, confirm, valid){
		
				
		// console.log(firstPassword);
		// console.log(confirm);
		//console.log("Inside register function in userCtrl")
		
		//toggles display of loading icon, visible on slow connection if browser's speed is throttled.
		app.loading = true;				
		if(valid){
			User.registerUser(app.regData).then(function(data){	
				if(data.data.success){
					//lost scope of the controller's 'this' key inside of this function, hence use of var app
					app.loading = false;				
					
					//if user performed incorrect registration, but hasn't reloaded the view, then remove old error message														
					app.errorMsg = false;
					app.successMsg = data.data.message;

					app.regData = null;
					//passwords under different model name due to use inside custom directive for comparing	each other
					$scope.firstPassword = null;
					$scope.confirm = null;

						//this is the correct way to clear form, but isn't performing as hoped
						// $scope.regForm.$setPristine();
						// $scope.regForm.$setUntouched();			
					
					//user doesn't need to stay here after successful registration, so redirect them			
					$timeout(function(){
						//acts as simple redirect
						$location.path('/login');
					}, 2000);								
					
				}
				else{
					app.loading = false;
					app.errorMsg = data.data.message;
				}
			});						
		} else {
			//error message created due to regForm.$valid's value in our registration
			app.loading = false;
			app.errorMsg = 'Please ensure form is filled out properly';
		}
		
	};
	
	this.checkUsername = function(regdata){
		//toggles loading animation on slow connections in our register view
		app.checkingUsername = true; 

		console.log("hit check username");
		$timeout(function(){
					//acts as simple redirect
					app.checkingUsername = false; 			
				}, 1000);								
		
		
	}

	this.checkEmail = function(regdata){

		
		app.checkingEmail = true; 

		$timeout(function(){
					//acts as simple redirect
					app.checkingEmail	 = false; 			
				}, 100);								

		console.log("hit check email");
		
	}
})

.directive('match', function() {
  return {
    restrict: 'A',
    controller: function($scope) {

    	$scope.confirmed = false;

    	//to get value from $observe which is inside 'link:', we must pass the value like so
    	$scope.doConfirm = function(values){
    		
    		//ele is the value of ng-model=firstPassword
    		//and $scope.confirm is the value of ng-model=confirm
    		values.forEach(function(ele){    			
    			// Uncomment these next 2 lines, then enter a VALID password into the ng-model='firstPassword' input
    			//then start writing in the ng-model='confirm' input, and look at the console for a full demo of the directive
    			// console.log(ele);
    			// console.log($scope.confirm);

    			if($scope.confirm == ele){    				
    				$scope.confirmed = true;
    			} else {
    				$scope.confirmed = false;
    			}
    		})
    	}
    },

    //we have passed our scope to the directive,
    //we said above that we want to match an attribute, hence why we get the value back from our view's 'match='
    //the following "link:" essentially links back to the anonymous controller in the directive
    link: function(scope, element, attrs) {
    	//observe our 'match' attribute we've created
    	/*	the match attr is mapped to the value of ng-model=firstPassword, so each time 
    	we type in the firstPassword textbox, the match attr is updated. due to this observe, you'll
    	see each change logged in console
    	'match' is a custom boolean attribute of ng-model="confirm"	*/
    	attrs.$observe('match', function(){    		
    		// can no longer write as the next line due to above use of values.foreach(){}
    		//gives a typeerror
    		//scope.doConfirm(attrs.match);

    		scope.matches = JSON.parse(attrs.match);
    		scope.doConfirm(scope.matches);    		
    	})

    	//this is the confirm password input
    	scope.$watch('confirm', function(){
    		
    		scope.matches = JSON.parse(attrs.match);
    		scope.doConfirm(scope.matches);
    	})

    }    	
  };
})
