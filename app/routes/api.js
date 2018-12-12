var User = require('../models/user.js');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = function(router){
    

    
    var options = {
      auth: {
        api_user: 'nmawungwe',
        api_key: 'PeterhouseR25'
      }
    }
    
    var client = nodemailer.createTransport(sgTransport(options));
    
//http://localhost:8080/api/users
//user registration
router.post('/users', function(req,res){
    console.log("registration body:", req.body);
    var user = new User();
    user.firstname = req.body.firstname;
    user.surname = req.body.surname;
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;
    user.color = req.body.color;
    user.temporarytoken = jwt.sign({firstname: user.firstname, surname: user.surname, email: user.email, username: user.username, color: user.color}, secret, { expiresIn: '24h'});
    if (req.body.firstname==null || req.body.firstname ==''|| req.body.surname==null || req.body.surname =='' || req.body.email==null || req.body.email ==''|| req.body.username==null || req.body.username ==''|| req.body.password==null || req.body.password ==''|| req.body.color==null || req.body.color ==''){
         res.json({success: false, message:'Ensure firstname, surname, email, username and password were provided'})
    } else{
        user.save(function(err){
            if (err) {
                console.log(err)
                res.json({success: false, message:'Username or Email already exists! Also ensure your password is more than 5 characters', error: err});
            } else{

                var email = {
                    from: 'Nyasha Mawungwe, nyasha@localhost.com',
                    to: user.email,
                    subject: 'FMG development challenge activation link',
                    text: 'Hello ' + user.firstname + ',Thank you for registering at localhost.com. Please click on the following link to complete your activation:"http://localhost:8080/activate/' + user.temporarytoken,
                    html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br>Thank you for registering at FMG development challenge. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8080/activate/' + user.temporarytoken + '">http://localhost:8080/activate</a>'
                  };
                  
                  client.sendMail(email, function(err, info){
                      if (err ){
                        console.log(err);
                      }
                      else {
                        console.log('Message sent: ' + info.response);
                      }
                  });
   

                res.json({success: true, message:'Account registered! Please check your email for activation link.'});
            }
        }); 

    }

});   


router.post('/checkusername', function(req, res){
    User.findOne({username:req.body.username}).select('username').exec(function(err,user){
        if (err) throw err;

        if (user){
            res.json({success:false, message:'That username is already taken'});
        }else{
            res.json({success: true, message:'Valid username'});
       }
    })
});

router.post('/checkemail', function(req, res){
    User.findOne({email:req.body.email}).select('email').exec(function(err,user){
        if (err) throw err;
 
        if (user){
            res.json({success:false, message:'That e-mail is already taken'});
        }else{
            res.json({success: true, message:'Valid e-mail'});
        }
    })
});




//User login route 
//http://locahost:port/api/authenticate
router.post('/authenticate', function(req, res){
    User.findOne({username:req.body.username}).select('email username password active ').exec(function(err,user){
        if (err) throw err;
        console.log("login body", req.body);
        let validPassword = user.comparePassword(req.body.password );
        console.log("testing validPassword: ", validPassword); 
        console.log("")
        //let validPassword = null;
        if (!user){
            res.json({success: false, message:'Could not authenticate user'});
        } else if  (user){
            if(req.body.password){
                //var validPassword = user.comparePassword(req.body.password );
            }else {
                res.json({success: false, message:'No password provided'});
            }     
            if(!validPassword){
                res.json({success: false, message:'Could not authenticate password'});
            } else if (!user.active){
                res.json({success: false, message: 'Acoount is not yet activated.Please check your email'});
            } else { 
                var token = jwt.sign({firstname: user.firstname, surname: user.surname, email: user.email, username: user.username, color: user.color}, secret, { expiresIn: '24h'});
                 res.json({success:true, message:' User authenticated!', token: token});
            }
        }
    });
});

router.get('/resetusername/:email', function(req, res){
    User.findOne({email: req.params.email}).select('email firstname username' ).exec(function(err, user) {
        if(err){
            res.json({success: false, message: err});
        } else {
            if(!req.params.email){
                res.json({success: false, message:'No e-mail provided'});
            } else{
                if(!user){
                    res.json({success: false, message:'E-mail not found'}); 
                } else {
                    var email = {
                        from: 'Nyasha Mawungwe, nyasha@localhost.com',
                        to: user.email,
                        subject: 'FMG username request',
                        text: 'Hello ' + user.firstname + 'You recently requested your username please save it in your file' + user.username,
                        html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br>You recently requested your username please save it in your file ' + user.username
                      };
                            client.sendMail(email, function(err, info){
                          if (err ){
                            console.log(err);
                          }
                          else {
                            console.log('Message sent: ' + info.response);
                          }
                      });
                    res.json({success: true, messsage: 'Username has been sent to e-mail!'})
                }
            }
            
        }
    })
});

router.put('/resetpassword', function(req, res){
User.findOne({username: req.body.username}).select('username active email firstname resettoken').exec(function(err, user){
    if (err) throw err;
    if (!user){
        res.json({success: false, message: 'Username not found'});
    }else if(!user.active){
        res.json({ success: false, message: 'Account has not been activated yet'});
    } else {
        user.resettoken= jwt.sign({ email: user.email, username: user.username}, secret, { expiresIn: '24h'}); 
        user.save(function(err){
            if(err){
                res.json({success: false, message: err});
            } else { 
                var email = {
                    from: 'Nyasha Mawungwe, nyasha@localhost.com',
                    to: user.email,
                    subject: 'FMG reset password request',
                    text: 'Hello ' + user.firstname + 'You recently requested a reset password link. Please click on the link to reset your password: http://localhost:8080/reset/' + user.resettoken,
                    html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br>You recently requested a reset password link. Please click on the link below to your password.<br><br><a href="http://localhost:8080/reset/' + 
                    user.resettoken +'">http://localhost:8080/reset/<a>' 
                  };
                        client.sendMail(email, function(err, info){
                      if (err ) console.log(err);
                      });
                        res.json({success: true, message: 'Please check your email for password reset link'});
            }
        })
    }
});
});

router.get('/resetpassword/:token', function(req, res){
    User.findOne({resettoken: req.params.token}).select().exec(function(err, user){
        if(err) throw err;
        var token = req.params.token;
        //function to verify token
            jwt.verify(token, secret, function(err, decoded){
            if(err){
            res.json({success: false, message:'Password link has expired'});
            } else {
                    if(!user){
                        res.json({success: false, message: 'Password link has expired'});
                    } else {
                        res.json({ success: true, user: user})
                    }
    } 
    });
});
});

router.put('/savepassword', function(req, res){
    User.findOne({username: req.body.username}).select('username email firstname resettoken').exec(function(err, user){
        if(err) throw err;
        if(req.body.password == null || req.body.password ==''){
        res.json({success:false, message: 'Password not provided'});  
        }else{     
            user.password = req.body.password;
            user.resettoken = false;
            user.save(function(err){
           if (err) {res.json({success: false, message: err})
           }else{                 
            var email = {
            from: 'Nyasha Mawungwe, nyasha@localhost.com',
            to: user.email,
            subject: 'FMG reset password',
            text: 'Hello ' + user.firstname + 'This email is to notify you that your password was recently reset at FMG localhost.com',
            html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br> This email is to notify you that your password was recently reset at FMG localhost.com'
          };
                client.sendMail(email, function(err, info){
              if (err ) console.log(err);
              }); 
               res.json({success: true, message: 'Password has been reset!'});
           }
            });           
        }
    });
});

router.put('/activate/:token', function(req,res){
    User.findOne({temporarytoken: req.params.token}, function(err,user){
    if (err) throw err;
    var token = req.params.token;
// checking if token hasn't expired
    jwt.verify(token, secret, function(err, decoded){
        if(err){
            res.json({success: false, message:'Activation link has expired.'});
        } else if (!user) {
            res.json({success: false, message:'Activation link has expired.'});
        } else{
            user.temporarytoken=null;
            user.active = true;
            User.findByIdAndUpdate(user._id, user, function(err, updatedUser){
                if (err) { 
                console.log(err);
            } else {
                var email = {
                    from: 'Nyasha Mawungwe, nyasha@localhost.com',
                    to: user.email,
                    subject: 'FMG development challenge Account Activated',
                    text: 'Hello ' + user.firstname + ',Your account has been successfully activated!',
                    html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br>Your account has been successfully activated!'
                  };
                        client.sendMail(email, function(err, info){
                      if (err ){
                        console.log(err);
                      }
                      else {
                        console.log('Message sent: ' + info.response);
                      }
                  });

                res.json({success: true, message:'Account Activated'});
            }
            })     

        }
    });


    });
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
    User.findOne({username: req.decoded.username}, function(err, user){
        if (err) return res.status(500).send({success: false, error: err});
        res.send(user);
    })
    //res.send(req.decoded);
    
});
return router;
}

  
