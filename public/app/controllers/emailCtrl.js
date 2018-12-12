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
    app.successMsg = ('Username has been sent to your email address!');
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
})

.controller('passwordCtrl', function(User){

    app = this 
        app.sendPassword = function(resetData, valid){
    
        app.errorMsg = false;
        app.loading = true;
        app.disabled = true;
    
        if (valid){

        User.sendPassword(app.resetData).then(function(data){
            app.loading = false;
            if (data.data.success){ 
        app.successMsg = ('Please check your e-mail for password reset link!');
            } else {
                app.disabled = false;
                app.errorMsg = data.data.message;
            }
        });
    } else{
        app.disabled = false;
        app.loading = false;
        app.errorMsg = 'Please enter a valid username';
    }
    };      //User.sendUsername(resetData)
    })

    .controller('resetCtrl', function(User, $routeParams, $scope, $timeout, $location){
        app = this;
        app.hide = true;


        User.resetUser($routeParams.token).then(function(data){
            if (data.data.success){
                app.hide = false;
                app.successMsg = 'Please enter a new password';
                $scope.username = data.data.user.username;
            } else {
                app.errorMsg = data.data.message;
            }
        });

        app.savePassword = function(regData, valid){
            app.errorMsg = false;
            app.disabled = true;
            app.loading = false;
            if (valid){ 
                app.regData.username = $scope.username;
                User.savePassword(app.regData).then(function(data){
                    app.loading = false;
                     if(data.data.success){
                         app.successMsg = data.data.message + '....Redirecting';
                         $timeout(function(){
                             $location.path('/login');
                         }, 2000);
                     } else{
                        app.loading = false;
                        app.disabled = false;
                        app.errorMsg = data.data.message;
                     }
                });
            }else{
                app.loading = false;
                app.disabled = false;
                app.errorMsg = 'Please ensure form is filled out properly';   
            }
        }
    })



