angular.module('mainController',['authServices', 'userServices','fileModelDirective','uploadFileService'])
.controller('mainCtrl', function(Auth, $timeout,$location,$rootScope,$interval,$window,$route,User,AuthToken,$scope,uploadFile){   
    // console.log('Testing testing')
    var app =this;
    app.loadme = false;
    $scope.file = {};
    
    $scope.Submit = function(){
                $scope.uploading = true;
                uploadFile.upload($scope.file).then(function(data){
            if (data.data.success){
                $scope.uploading = false;
                $scope.alert='alert alert-success';
                $scope.message = data.data.message;
                $scope.file = {}; 
            } else {
                $scope.uploading = false;
                $scope.alert = 'alert alert-danger';
                $scope.message = data.data.message;
                $scope.file = {}; 
            }
        }) 
    };

    app.checkSession = function(){
         if (Auth.isLoggedIn()){
              app.checkingSession = true;
              var interval = $interval(function(){ 
                var token = $window.localStorage.getItem('token'); 
                if (token === null){
                    $interval.cancel(interval);
                } else {
                    self.parseJwt = function(token){
                        var base64Url = token.split('.')[1];
                        var base64 = base64Url.replace('-', '+').replace('_', '/');
                        return JSON.parse($window.atob(base64));
                    }
                    var expireTime = self.parseJwt(token);
                    var timeStamp = Math.floor(Date.now()/1000);
                    console.log(expireTime.exp);
                    console.log(timeStamp); 
                    var timeCheck = expireTime.exp - timeStamp;
                    console.log('timeCheck:' + timeCheck); 
                    if (timeCheck <= 10){
                        console.log('token has expired');
                        showModal(1);
                        $interval.cancel(interval);
                    } else {
                        console.log('token has not yet expired');
                    }

                }
                 
              }, 10000);
         }
          
    };

    app.checkSession();

    var showModal = function(option){
        app.choiceMade = false;
        app.modalHeader = undefined;
        app.modalBody = undefined;
        app.hideButton = false;

 
         if(option === 1){
            app.modalHeader = 'Timeout Warning';
            app.modalBody = 'Your session will expire in 5 mins. Would you like to renew your session?';
            $("#myModal").modal({backdrop: "static"});
         } else if (option === 2){
             //Logout option
            app.hideButton = true;
            app.modalHeader = 'Logging Out';
            $("#myModal").modal({backdrop: "static"});
            $timeout(function(){
                Auth.logout();
                $location.path('/');
                hideModal();
                $route.reload();
            }, 3000);
         }
         $timeout(function(){
            if (!app.choiceMade){;
                hideModal();
            }
        }, 4000);
    };

        app.renewSession = function(){
        app.choiceMade = true;
        User.renewSession(app.username).then(function(data){
            if(data.data.success){
                AuthToken.setToken(data.data.token);
                app.checkSession();
            }else{
                app.modalBody = data.data.message;
            }
    })
        hideModal();
    };

    app.endSession = function(){
        app.choiceMade = true;
        hideModal();
        $timeout(function(){
            showModal(2)
        }, 1000);
    };


    var hideModal = function(){
    $("#myModal").modal('hide');
    };

    //will run code every time a route changes 
    $rootScope.$on('$routeChangeStart',function(){
        if(!app.checkSession) app.checkSession();
        
        
        if(Auth.isLoggedIn()){
            app.isLoggedIn = true;
            Auth.getUser().then(function(data){
                console.log(data)
                app.firstname=data.data.firstname;
                app.surname=data.data.surname;
                app.username=data.data.username;
                 app.useremail=data.data.email;
                 app.color=data.data.color;
                 app .loadme=true;
            });
        } else{
            app.isLoggedIn = false;
            app.username='';
            app.loadme=true;
        }
    });



this.doLogin  = function(loginData){
    app.loading = true;
    app.errorMsg = false;

    Auth.login(app.loginData).then(function(data){
        if(data.data .success){
          app.loading = false;  
             // create success message
             app.successMsg = data.data.message + '...Redirecting';
             // redirect to home page
             $timeout(function(){
                $location.path('/about');
                app.loginData = '';
                app.successMsg= false;
                app.checkSession();
             },2000);
        } else {
             // create error message
             app.loading = false;   
             app.errorMsg = data.data.message;
        }
    });
}; 

this.logout=function(){
    showModal(2); 
};

});










