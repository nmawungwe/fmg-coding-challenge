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
 
 