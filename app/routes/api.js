var User = require('../models/user.js');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';

module.exports = function(router){
//http://localhost:8080/api/users
//user registration
router.post('/users', function(req,res){
    var user = new User();
    user.firstname = req.body.firstname;
    user.surname = req.body.surname;
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;
    user.color = req.body.color;
    if (req.body.firstname==null || req.body.firstname ==''|| req.body.surname==null || req.body.surname =='' || req.body.email==null || req.body.email ==''|| req.body.username==null || req.body.username ==''|| req.body.password==null || req.body.password ==''|| req.body.color==null || req.body.color ==''){
         res.json({success: false, message:'Ensure firstname, surname, email, username and password were provided'})
    } else{
        user.save(function(err){
            if (err) {
                res.json({success: false, message:'Username or Email already exists!'});
            } else{
                res.json({success: true, message:'User created!'});
            }
        }); 

    }

});   
//User login route 
//http://locahost:port/api/authenticate
router.post('/authenticate', function(req, res){
    User.findOne({username:req.body.username}).select('email username password').exec(function(err,user){
        if (err) throw err;

        if (!user){
            res.json({success: false, message:'Could not authenticate user'});
        } else if  (user){
            if(req.body.password){
                var validPassword = user.comparePassword(req.body.password );
            }else{
                res.json({success: false, message:'No password provided'});
            }          
            if(!validPassword){
                res.json({success: false, message:'Could not authenticate password'});
            } else { 
                var token = jwt.sign({firstname: user.firstname, surname: user.surname, email: user.email, username: user.username, color: user.color}, secret, { expiresIn: '24h'});
                 res.json({success:true, message:' User authenticated', token: token});
            }
        }
    })
});

router.use(function(req, res, next){
var token = req.body.token||req.body.query||req.headers['x-access-token'];

if (token){
//verify token
jwt.verify(token, secret, function(err, decoded){
    if(err){
        res.json({success: false, message:'Token invalid'});
    } else {
        req.decoded = decoded;
        next();
    } 
});
} else {
    res.json({success: false, message:'No token provided'});
}

});

router.post('/me', function(req,res){
    res.send(req.decoded);
});
return router;
}

  
