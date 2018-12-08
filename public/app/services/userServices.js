angular.module('userServices',[])

.factory('User', function($http){
    var userFactory = {};
    
    //User.create(regData);   
    userFactory.create = function(regData){
        return $http.post('/api/users', regData);
    }


    //User.checkUsername(regData);
    userFactory.checkUsername = function(regData){
        return $http.post('/api/checkusername', regData);
    }
    //User.checkEmail(regData);
    userFactory.checkEmail = function(regData){
        return $http.post('/api/checkemail', regData);
    }
    //User.activateAccount(token);
    userFactory.activateAccount = function(token){
        return $http.put('/api/activate/'+ token);
    }

    //User.sendUsername(userData);
    userFactory.sendUsername = function(userData){
        return $http.get('/api/resetusername/' + userData);
    };
    
    return userFactory;
}); 
