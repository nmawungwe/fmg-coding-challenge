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
})

.controller('usernameCtrl', function(User){

app = this 

    app.sendUsername = function(userData, valid){

    app.errorMsg = false;
    app.loading = true;
    app.disabled = true;

    if (valid){
    User.sendUsername(app.userData.email).then(function(data){
        app.loading = false;
        if (data.data.success){ 
    app.successMsg = data.data.message;
        } else {
            app.disabled = false;
            app.errorMsg = data.data.message;
        }
    });
} else{
    app.disabled = false;
    app.loading = false;
    app.errorMsg = 'Please enter a valid e-mail';
}

};


    //User.sendUsername(userData)
});



