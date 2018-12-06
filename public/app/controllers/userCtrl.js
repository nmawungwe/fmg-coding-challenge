angular.module('userControllers',['userServices'])  

.controller('regCtrl',function($http,$location,$timeout, User){
    
    var app =this;

    this.regUser = function(regData){
        app.loading = true;
        app.errorMsg = false;

        User.create(app.regData).then(function(data){
            if(data.data .success){
              app.loading = false;  
                 // create success message
                 app.successMsg = data.data.message + '...Redirecting';
                 // redirect to home page
                 $timeout(function(){
                    $location.path('/');
                 },2000);
            } else {
                 // create error message
                 app.loading = false;  
                 app.errorMsg = data.data.message;

            }
        });
    }; 
});



this.checkUsername = function(regData){
    app.checkingUsername = true;
    app.usenameMsg = false;
    app.usernameInvalid = false;

    User.checkUsername(app.regData).then(function(data){
       if(data.data.success){
        app.checkingUsername = false;
        app.usernameInvalid = false;
           app.usernameMsg = data.data.message;
       }else{
        app.checkingUsername = false;
        app.usernameInvalid = true;
           app.usernameMsg = data.data.message;
       }
    });
}

this.checkEmail = function(regData){
    app.checkingEmail = true;
    app.emailMsg = false;
    app.emailInvalid = false;

    User.checkEmail(app.regData).then(function(data){
       if(data.data.success){
        app.checkingEmail = false;
        app.emailInvalid = false;
           app.emailMsg = data.data.message;
       }else{
        app.checkingEmail = false;
        app.emailInvalid = true;
           app.emailMsg = data.data.message;
       }
    });
}
    
app.directive('match',function() {
    return {
        restrict: 'A',
        controller: function($scope){
            
            $scope.confirmed = false;
            $scope.doConfirm = function(values){
                values.forEach(function(ele){
                    if ($scope.confirm == ele){
                        $scope.confirmed = true;
                    }else{
                        $scope.confirmed = false;
                    }

                });
        }

        },

        link: function(scope, element, attrs){

            attrs.$observe('match', function(){
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });

            scope.$watch('confirm',function(){
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });

        }
    };
})





//User.checkEmail(regData)