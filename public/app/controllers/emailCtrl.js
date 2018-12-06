angular.module('emailController',['userServices'])

.controller('emailCtrl', function($routeParams, User, $location, $timeout){

    app = this;

    User.activateAccount($routeParams.token).then(function(data){
        
        app.successMsg = false;
        app.errorMsg = false;
        
        if(data.data.success){
            app.successMsg = data.data.message + '...Redirecting';
            $timeout(function(){
                $location.path('/login');
            }, 2000);
        }else{
            app.errorMsg = data.data.message + '...Redirecting';
            $timeout(function(){
                $location.path('/login');
            }, 2000);
            
        }
    });
});

